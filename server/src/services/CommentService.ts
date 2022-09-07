import { Comment } from '@prisma/client';
import AppError from '../lib/AppError';
import db from '../lib/db';

class CommentService {
  private static instance: CommentService;

  public static getInstance() {
    if (!CommentService.instance) {
      CommentService.instance = new CommentService();
    }
    return CommentService.instance;
  }

  async getComments(itemId: number) {
    const comments = await db.comment.findMany({
      where: {
        itemId,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        user: true,
      },
    });

    return this.groupSubcomments(this.redact(comments));
  }

  redact(comments: Comment[]) {
    return comments.map((comment) => {
      //? 삭제된 댓글 (deletedAt이 존재)인 경우 댓글 정보를 변조해서 내보낸다.
      if (!comment.deletedAt) return comment;
      const someDate = new Date(0);
      return {
        ...comment,
        likesCount: 0,
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
      };
    });
  }

  /**
   * 댓글 배열에 대댓글 배열을 추가해서 리턴하는 함수
   * @param comments
   */
  async groupSubcomments(comments: Comment[]) {
    const rootComments = comments.filter(
      (comment) => comment.parentCommentId === null,
    );

    //? 대댓글이 있는 댓글들을 찾아서 맵에 저장한다. (key: 루트 댓글 ID, value: 대댓글 배열)
    const subCommentsMap = new Map<number, Comment[]>();

    comments.forEach((comment) => {
      if (!comment.parentCommentId) return; // 루트 댓글은 제외
      const subcommentsArr = subCommentsMap.get(comment.parentCommentId) ?? [];
      subcommentsArr.push(comment);
      subCommentsMap.set(comment.parentCommentId, subcommentsArr);
    });

    // 루트 댓글에 대댓글 배열 정보를 추가한다.
    const merged = rootComments.map((comment) => ({
      ...comment,
      subcomments: subCommentsMap.get(comment.id) ?? [],
    }));

    return merged;
  }

  async getComment(commentId: number, withSubComments: boolean = false) {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: true,
        mentionUser: true,
      },
    });

    if (!comment || comment.deletedAt) {
      throw new AppError('NotFoundError');
    }

    if (withSubComments) {
      const subcomments = await this.getSubcomments(commentId);
      return {
        ...comment,
        subcomments,
      };
    }

    return comment;
  }

  async getSubcomments(commentId: number) {
    return await db.comment.findMany({
      where: {
        parentCommentId: commentId,
      },
      orderBy: {
        id: 'asc',
      },
      include: {
        user: true,
        mentionUser: true,
      },
    });
  }

  async createComment({
    itemId,
    text,
    userId,
    parentCommentId,
  }: CreateCommentParams) {
    //? 대댓글, 대대댓글 등의 경우 부모 댓글 ID를 댓글 대상이 아닌 최상단 댓글로 지정한다.
    //? 대신 대댓글의 userId를 맨션유저아이디로 지정해서 어느 댓글의 대댓글인지 구별할 수 있도록 한다.

    const parentComment = parentCommentId
      ? await this.getComment(parentCommentId)
      : null;

    const rootParentCommentId = parentComment?.parentCommentId;
    const targetParentCommentId = rootParentCommentId ?? parentCommentId;

    const comment = await db.comment.create({
      data: {
        text,
        itemId,
        userId,
        parentCommentId: targetParentCommentId,
        mentionUserId: parentComment?.userId, //? 대댓글을 달 댓글의 userID
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
        likesCount: count,
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

  async deleteComment({ commentId, userId }: CommentParams) {
    const comment = await this.getComment(commentId);

    if (comment.userId !== userId) {
      throw new AppError('ForbiddenError');
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

  async updateComment({ commentId, text, userId }: UpdateCommentParams) {
    const comment = await this.getComment(commentId);

    if (comment.userId !== userId) {
      throw new AppError('ForbiddenError');
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

    return this.getComment(commentId, true);
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
