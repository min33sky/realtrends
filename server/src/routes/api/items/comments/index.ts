import { FastifyPluginAsync } from 'fastify';
import { createAuthorizedRoute } from '../../../../plugins/requireAuthPlugin';
import { CommentsRoute, CommentsRouteSchema } from './schema';

export const commentsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<CommentsRoute['GetComments']>(
    '/',
    { schema: CommentsRouteSchema.GetComments },
    async (request) => {},
  );

  fastify.get<CommentsRoute['GetSubComments']>(
    '/:commentId/subcomments',
    async () => {},
  );

  fastify.register(authorizedCommentsRoute);
};

const authorizedCommentsRoute = createAuthorizedRoute(async (fastify) => {
  fastify.post<CommentsRoute['CreateComment']>(
    '/',
    { schema: CommentsRouteSchema.CreateComment },
    async (request) => {
      const { id } = request.params;
      const { text } = request.body;
    },
  );

  fastify.post<CommentsRoute['LikeComment']>(
    '/:commentId/likes',
    async () => {},
  );
  fastify.delete<CommentsRoute['UnlikeComment']>(
    '/:commentId/likes',
    async () => {},
  );
  fastify.delete<CommentsRoute['DeleteComment']>('/:commentId', async () => {});
  fastify.patch<CommentsRoute['UpdateComment']>('/:commentId', async () => {});
});
