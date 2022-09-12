import { Comment, CommentLike } from '@prisma/client';
import AppError from '../lib/NextAppError';
import db from '../lib/db';

class CommentService {
  private static instance: CommentService;

  public static getInstance() {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService();
    }
    return CommentService.instance;
  }

  /**
   * 댓글 목록 가져오기
   * @description userId가 존재하면 댓글 좋아요 여부도 함께 가져온다.
   */
  async getComments({
    itemId,
    userId,
  }: {
    itemId: number;
    userId?: number | null;
  }) {
    const comments = await db.comment.findMany({
      where: {
        itemId,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        user: true, // 작성자 정보
        mentionUser: true, // 맨션된 유저 정보
      },
    });

    //? userId가 있다면 좋아요 누른 댓글 정보도 가져온다.
    const commentLikedMap = userId
      ? await this.getCommentLikedMap({
          commentIds: comments.map((c) => c.id),
          userId,
        })
      : {};

    // 좋아요 정보를 추가한다.
    const commentsWithIsLiked = comments.map((comment) => ({
      ...comment,
      isLiked: !!commentLikedMap[comment.id],
    }));

    return this.groupSubcomments(this.redact(commentsWithIsLiked));
  }

  redact(comments: Comment[]) {
    return comments.map((comment) => {
      //? 삭제된 댓글 (deletedAt이 존재)인 경우 댓글 정보를 변조해서 내보낸다.
      if (!comment.deletedAt)
        return {
          ...comment,
          isDeleted: false,
        };

      const someDate = new Date(0);
      return {
        ...comment,
        likes: 0,
        createdAt: someDate,
        updatedAt: someDate,
        subcommentsCount: 0,
        text: '삭제된 댓글입니다.',
        user: {
          id: -1,
          username: 'deleted',
        },
        mentionUser: null,
        subcomments: [],
        isDeleted: true,
      };
    });
  }

  /**
   * 댓글 배열에 대댓글 배열을 추가해서 반환하는 함수
   * @param comments
   */
  async groupSubcomments<T extends Comment>(comments: T[]) {
    const rootComments = comments.filter(
      (comment) => comment.parentCommentId === null,
    );

    //? 대댓글이 있는 댓글들을 찾아서 맵에 저장한다. (key: 루트 댓글 ID, value: 대댓글 배열)
    const subCommentsMap = new Map<number, T[]>();

    comments.forEach((comment) => {
      if (!comment.parentCommentId) return; //* 루트 댓글은 제외
      if (comment.deletedAt !== null) return; //* 삭제된 댓글은 제외
      const subcommentsArr = subCommentsMap.get(comment.parentCommentId) ?? [];
      subcommentsArr.push(comment);
      subCommentsMap.set(comment.parentCommentId, subcommentsArr);
    });

    //? 루트 댓글에 대댓글 배열 정보를 추가한다.
    //? 댓글이 삭제된 경우에는 배열에서 제외한다.
    //? 단, 대댓글이 있는 댓글의 경우 댓글이 삭제되었어도 배열에 포함한다.
    const merged = rootComments
      .map((comment) => ({
        ...comment,
        subcomments: subCommentsMap.get(comment.id) ?? [],
      }))
      .filter(
        (comment) =>
          comment.deletedAt === null || comment.subcomments.length !== 0,
      );

    return merged;
  }

  /**
   * 댓글 가져오기
   */
  async getComment({
    commentId,
    userId,
    withSubcomments,
  }: {
    commentId: number;
    withSubcomments?: boolean;
    userId?: number | null;
  }) {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        mentionUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    //? userId가 있다면 좋아요 누른 댓글인지 확인한다.
    const commentLike = userId
      ? await db.commentLike.findUnique({
          where: {
            userId_commentId: {
              userId,
              commentId,
            },
          },
        })
      : null;

    if (!comment || comment.deletedAt) {
      throw new AppError('NotFound');
    }

    if (withSubcomments) {
      const subcomments = await this.getSubcomments({ commentId, userId });

      return {
        ...comment,
        subcomments,
        isLiked: !!commentLike,
        isDeleted: false,
      };
    }

    return {
      ...comment,
      isLiked: !!commentLike,
      isDeleted: false,
    };
  }

  /**
   * 대댓글 가져오기
   * @description userId가 있다면 좋아요 누른 대댓글 정보도 가져온다.
   */
  async getSubcomments({
    commentId,
    userId,
  }: {
    commentId: number;
    userId?: number | null;
  }) {
    const subcomments = await db.comment.findMany({
      where: {
        parentCommentId: commentId,
        deletedAt: null,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        mentionUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    const commentLikedMap = userId
      ? await this.getCommentLikedMap({
          commentIds: subcomments.map((comment) => comment.id),
          userId,
        })
      : {};

    return subcomments.map((subcomment) => ({
      ...subcomment,
      isLiked: !!commentLikedMap[subcomment.id],
      isDeleted: false,
    }));
  }

  /**
   * 댓글 작성
   * @description parentCommentId는 댓글을 달 댓글의 ID라고 생각하자. (루트 댓글은 undefined)
   */
  async createComment({
    itemId,
    text,
    userId,
    parentCommentId,
  }: CreateCommentParams) {
    if (text.length > 300 || text.length === 0) {
      throw new AppError('BadRequest', {
        message: '댓글은 1자 이상 300자 이하로 작성해주세요.',
      });
    }

    //? 댓글은 parentCommentId가 null, 대댓글의 경우 parentCommentId가 있다
    //? 대대댓글의 경우 대댓글과 동일한 parentCommentId를 가진다.
    //? 대신 대댓글의 userId를 mentionUserId로 지정해서 어느 대댓글의 대대댓글인지 구별할 수 있도록 한다.

    const parentComment = parentCommentId
      ? await this.getComment({ commentId: parentCommentId })
      : null;

    const rootParentCommentId = parentComment?.parentCommentId; // 루트댓글의 경우에는 null
    const targetParentCommentId = rootParentCommentId ?? parentCommentId; // 대댓글 이상에서만 존재하는 값

    //? mention 조건: 타인의 댓글에 대댓글을 달 때만 허용
    const shouldMention =
      !!rootParentCommentId && parentComment?.userId !== userId;

    const comment = await db.comment.create({
      data: {
        text,
        itemId,
        userId,
        parentCommentId: targetParentCommentId, //? 대댓글 이상에서만 존재
        mentionUserId: shouldMention ? parentComment?.userId : null, //? 대대댓글을 달 대댓글의 userID
      },
      include: {
        user: true,
        mentionUser: true,
      },
    });

    //? 대댓글일 경우 댓글의 대댓글 개수를 업데이트 해준다.
    //? Listing할 때 Join해서 갯수를 가져오는 것보다 미리 갯수를 설정하는 것이
    //? 속도 면에서 효율적이다.
    if (parentCommentId) {
      const subcommentsCount = await db.comment.count({
        where: {
          parentCommentId: targetParentCommentId,
        },
      });

      await db.comment.update({
        where: {
          id: targetParentCommentId,
        },
        data: {
          subcommentsCount,
        },
      });
    }

    await this.countAndSyncComments(itemId);

    return {
      ...comment,
      isDeleted: false,
      subcomments: [],
    };
  }

  async likeComment({ commentId, userId }: CommentParams) {
    try {
      await db.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });
    } catch (e) {}

    return this.countAndSyncCommentLikes(commentId);
  }

  async unlikeComment({ commentId, userId }: CommentParams) {
    try {
      await db.commentLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });
    } catch (e) {}

    const count = await this.countAndSyncCommentLikes(commentId);
    return count;
  }

  /**
   * 댓글 좋아요 갯수를 파악하고 댓글 테이블을 업데이트하는 함수
   * @param commentId 댓글 ID
   * @returns 댓글 좋아요 갯수
   */
  async countAndSyncCommentLikes(commentId: number) {
    const count = await db.commentLike.count({
      where: {
        commentId,
      },
    });

    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likes: count,
      },
    });

    return count;
  }

  /**
   * 댓글 갯수를 파악하고 아이템 스텟 테이블을 업데이트하는 함수
   * @param itemId 아이템 ID
   * @returns 댓글 갯수
   */
  async countAndSyncComments(itemId: number) {
    const count = await db.comment.count({
      where: {
        itemId,
      },
    });

    await db.itemStats.update({
      where: {
        itemId,
      },
      data: {
        commentsCount: count,
      },
    });

    return count;
  }

  /**
   * 댓글 삭제
   */
  async deleteComment({ commentId, userId }: CommentParams) {
    const comment = await this.getComment({ commentId });

    if (comment.userId !== userId) {
      throw new AppError('Forbidden');
    }

    await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * 댓글 수정
   */
  async updateComment({ commentId, text, userId }: UpdateCommentParams) {
    const comment = await this.getComment({ commentId });

    if (comment.userId !== userId) {
      throw new AppError('Forbidden');
    }

    const updateComment = await db.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text,
      },
      include: {
        user: true,
      },
    });

    return this.getComment({ commentId, withSubcomments: true });
  }

  /**
   * 주어진 댓글들 중에서 해당 유저가 좋아요를 누른 댓글을 Map으로 반환하는 함수
   * @returns 댓글 번호를 Key, 좋아요 정보 객체를 value로 하는 Map을 반환
   */
  async getCommentLikedMap({
    commentIds,
    userId,
  }: {
    commentIds: number[];
    userId: number;
  }) {
    //? 좋아요를 누른 댓글 목록을 가져온다.
    const list = await db.commentLike.findMany({
      where: {
        userId,
        commentId: {
          in: commentIds,
        },
      },
    });

    return list.reduce((acc, cur) => {
      acc[cur.commentId] = cur;
      return acc;
    }, {} as Record<number, CommentLike>);
  }
}

interface CreateCommentParams {
  itemId: number;
  text: string;
  parentCommentId?: number;
  userId: number;
}

interface CommentParams {
  userId: number;
  commentId: number;
}

interface UpdateCommentParams extends CommentParams {
  text: string;
}

export default CommentService;
