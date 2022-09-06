import { FastifyPluginAsync } from 'fastify';
import { createAuthorizedRoute } from '../../../../plugins/requireAuthPlugin';
import CommentService from '../../../../services/CommentService';
import { CommentsRoute, CommentsRouteSchema } from './schema';

export const commentsRoute: FastifyPluginAsync = async (fastify) => {
  const commentService = CommentService.getInstance();

  fastify.get<CommentsRoute['GetComments']>(
    '/',
    { schema: CommentsRouteSchema.GetComments },
    async (request) => {
      return commentService.getComments(request.params.id);
    },
  );

  fastify.get<CommentsRoute['GetSubComments']>(
    '/:commentId/subcomments',
    async (request) => {
      return commentService.getSubcomments(request.params.commentId);
    },
  );

  fastify.register(authorizedCommentsRoute);
};

const authorizedCommentsRoute = createAuthorizedRoute(async (fastify) => {
  const commentService = CommentService.getInstance();

  fastify.post<CommentsRoute['CreateComment']>(
    '/',
    { schema: CommentsRouteSchema.CreateComment },
    async (request) => {
      const { id } = request.params;
      const { text, parentCommentId } = request.body;
      const userId = request.user?.id!;
      return commentService.createComment({
        itemId: id,
        text,
        userId,
        parentCommentId: parentCommentId ?? undefined,
      });
    },
  );

  fastify.post<CommentsRoute['LikeComment']>(
    '/:commentId/likes',
    {
      schema: CommentsRouteSchema.LikeComment,
    },

    async (request) => {
      const { commentId } = request.params;
      const userId = request.user?.id!;
      return commentService.likeComment({
        commentId,
        userId,
      });
    },
  );

  fastify.delete<CommentsRoute['UnlikeComment']>(
    '/:commentId/likes',
    async (request) => {
      const { commentId } = request.params;
      const userId = request.user?.id!;
      return commentService.unlikeComment({
        commentId,
        userId,
      });
    },
  );

  fastify.delete<CommentsRoute['DeleteComment']>(
    '/:commentId',
    async (request) => {
      const userId = request.user?.id!;
      const { commentId } = request.params;
      return commentService.deleteComment({
        commentId,
        userId,
      });
    },
  );

  fastify.patch<CommentsRoute['UpdateComment']>(
    '/:commentId',
    {
      schema: CommentsRouteSchema.UpdateComment,
    },
    async (request) => {
      const { commentId } = request.params;
      const userId = request.user?.id!;
      const { text } = request.body;
      return commentService.updateComment({
        commentId,
        userId,
        text,
      });
    },
  );
});
