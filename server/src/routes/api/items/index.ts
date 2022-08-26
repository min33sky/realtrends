import { FastifyPluginAsync } from 'fastify';

export const itemRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (request, reply) => {
    return {
      message: 'item route hola~',
    };
  });
};
