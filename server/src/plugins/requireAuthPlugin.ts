import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import AppError from '../lib/AppError';

const requireAuthPluginAsync: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    //? 토큰이 만료되었을 경우
    if (request.isExpiredToken) {
      throw new AppError('UnauthorizedError', {
        isExpiredToken: true,
      });
    }

    //? 로그인 정보가 없는 경우
    if (!request.user) {
      throw new AppError('UnauthorizedError', {
        isExpiredToken: false,
      });
    }
  });
};

/**
 ** 인증 라우트를 위한 Plugin
 */
const requireAuthPlugin = fp(requireAuthPluginAsync, {
  name: 'requireAuthPlugin',
});

/**
 * ProtectedRoute를 위한 함수
 * @param plugin fastify plugin
 * @returns fastify plugin
 */
export function createAuthorizedRoute(plugin: FastifyPluginAsync) {
  const wrappedPlugin: FastifyPluginAsync = async (fastify, opts) => {
    fastify.register(requireAuthPlugin);
    return plugin(fastify, opts);
  };
  return wrappedPlugin;
}

export default requireAuthPlugin;
