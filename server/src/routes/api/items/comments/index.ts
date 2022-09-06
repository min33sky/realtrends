import { FastifyPluginAsync } from 'fastify';
import { CommentsRoute, CommentsRouteSchema } from './schema';

export const commentsRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<CommentsRoute['GetComments']>(
    '/',
    { schema: CommentsRouteSchema.GetComments },
    async (request) => {
      console.log(request.params.id);
      return 'comments';
    },
  );

  fastify.post<CommentsRoute['CreateComment']>(
    '/',
    { schema: CommentsRouteSchema.CreateComment },
    async (request) => {
      const { id } = request.params;
      const { text } = request.body;
    },
  );

  fastify.get<CommentsRoute['GetSubComments']>(
    '/:commentId/subcomments',
    async () => {},
  );
};
