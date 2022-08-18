import { FastifyPluginAsync } from 'fastify';
import requireAuthPlugin from '../../../plugins/requireAuthPlugin';
import { getMeSchema } from './schema';

export const meRoute: FastifyPluginAsync = async (fastify) => {
  //? meRoute에서만 적용할 인증 Route Plugin을 설정
  fastify.register(requireAuthPlugin);

  fastify.get('/', { schema: getMeSchema }, async (request) => {
    return request.user;
  });
};
