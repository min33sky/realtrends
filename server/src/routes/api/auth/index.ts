import { FastifyPluginAsync } from 'fastify';
import requireAuthPlugin from '../../../plugins/requireAuthPlugin';
import UserService from '../../../services/UserService';
import { AuthBody } from '../../../types';
import { loginSchema, registerSchema } from './schema';

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance();

  //? 특정 Endpoint만 plugin 적용 테스트용
  fastify.register(async (_fastify, opts) => {
    _fastify.register(requireAuthPlugin);
    _fastify.get('/test', async (request, reply) => {
      return {
        message: 'Hello World!',
      };
    });
  });

  fastify.post<{ Body: AuthBody }>(
    '/login',
    { schema: loginSchema },
    async (request, reply) => {
      const authResult = await userService.login(request.body);

      reply.setCookie('access_token', authResult.tokens.accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60),
        path: '/', //? 전역에서 쿠키를 사용
      });
      reply.setCookie('refresh_token', authResult.tokens.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        path: '/',
      });

      return authResult;
    }
  );

  fastify.post<{ Body: AuthBody }>(
    '/register',
    { schema: registerSchema },
    async (request) => {
      return await userService.register(request.body);
    }
  );
};

export default authRoute;
