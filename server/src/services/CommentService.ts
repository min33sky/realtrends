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
    return await db.comment.findMany({
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
  }

  async getComment(commentId: number) {
    const comment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new AppError('NotFoundError');
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

    const comment = await db.comment.create({
      data: {
        text,
        itemId,
        userId,
        parentCommentId: rootParentCommentId ?? parentCommentId,
        mentionUserId: parentComment?.userId, //? 대댓글을 달 대상의 ID
      },
      include: {
        user: true,
      },
    });

    //? 대댓글일 경우 댓글의 대댓글 개수를 업데이트 해준다.
    //? Listing할 때 Join해서 갯수를 가져오는 것보다 미리 갯수를 설정하는 것이
    //? 속도 면에서 효율적이다.
    if (parentCommentId) {
      const subcommentsCount = await db.comment.count({
        where: {
          parentCommentId,
        },
      });

      await db.comment.update({
        where: {
          id: parentCommentId,
        },
        data: {
          subcommentsCount,
        },
      });
    }

    return comment;
  }

  async likeComment({ commentId, userId }: CommentParams) {
    await db.commentLike.create({
      data: {
        commentId,
        userId,
      },
    });

    return null;
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

  async countAndSyncCommentLikes(commentId: number) {
    const count = await db.commentLike.count({
      where: {
        commentId,
      },
    });
    return count;
  }

  async deleteComment({ commentId, userId }: CommentParams) {
    const comment = await this.getComment(commentId);

    if (comment.userId !== userId) {
      throw new AppError('ForbiddenError');
    }

    await db.comment.delete({
      where: {
        id: commentId,
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

    return updateComment;
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
