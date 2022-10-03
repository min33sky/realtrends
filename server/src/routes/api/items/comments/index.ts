import { FastifyPluginAsync } from 'fastify';
import { FastifyPluginAsyncTypebox } from '../../../../lib/types';
import { createAuthorizedRoute } from '../../../../plugins/requireAuthPlugin';
import CommentService from '../../../../services/CommentService';
import {
  createCommentSchema,
  deleteCommentSchema,
  getCommentSchema,
  getCommentsSchema,
  getSubCommentsSchema,
  likeCommentSchema,
  unlikeCommentSchema,
  updateCommentSchema,
} from './schema';

export const commentsRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  const commentService = CommentService.getInstance();

  fastify.get('/', { schema: getCommentsSchema }, async (request) => {
    return commentService.getComments({
      itemId: request.params.id,
      userId: request.user?.id,
    }) as any;
  });

  fastify.get('/:commentId', { schema: getCommentSchema }, async (request) => {
    const result = await commentService.getComment({
      commentId: request.params.commentId,
      userId: request.user?.id,
      withSubcomments: true,
    });

    return result as any;
  });

  fastify.get(
    '/:commentId/subcomments',
    {
      schema: getSubCommentsSchema,
    },
    async (request) => {
      return commentService.getSubcomments({
        commentId: request.params.commentId,
        userId: request.user?.id,
      }) as any;
    },
  );

  fastify.register(authorizedCommentsRoute);
};

const authorizedCommentsRoute = createAuthorizedRoute(async (fastify) => {
  const commentService = CommentService.getInstance();

  fastify.post('/', { schema: createCommentSchema }, async (request) => {
    const { id } = request.params;
    const { text, parentCommentId } = request.body;
    const userId = request.user?.id!;

    return (await commentService.createComment({
      itemId: id,
      text,
      userId,
      parentCommentId: parentCommentId ?? undefined,
    })) as any;
  });

  fastify.post(
    '/:commentId/likes',
    {
      schema: likeCommentSchema,
    },
    async (request) => {
      const { commentId } = request.params;
      const userId = request.user?.id!;
      const likes = await commentService.likeComment({
        commentId,
        userId,
      });
      return {
        id: commentId,
        likes,
      };
    },
  );

  fastify.delete(
    '/:commentId/likes',
    {
      schema: unlikeCommentSchema,
    },
    async (request) => {
      const { commentId } = request.params;
      const userId = request.user?.id!;
      const likes = await commentService.unlikeComment({
        commentId,
        userId,
      });
      return {
        id: commentId,
        likes,
      };
    },
  );

  fastify.delete(
    '/:commentId',
    {
      schema: deleteCommentSchema,
    },
    async (request, reply) => {
      const userId = request.user?.id!;
      const { commentId } = request.params;
      await commentService.deleteComment({
        commentId,
        userId,
      });

      reply.status(204);
    },
  );

  fastify.patch(
    '/:commentId',
    {
      schema: updateCommentSchema,
    },
    async (request) => {
      const { commentId } = request.params;
      const userId = request.user?.id!;
      const { text } = request.body;
      return commentService.updateComment({
        commentId,
        userId,
        text,
      }) as any;
    },
  );
});
