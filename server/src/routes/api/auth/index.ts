import AppError from '../../../lib/AppError';
import { clearCookie, setTokenCookie } from '../../../lib/cookies';
import { FastifyPluginAsyncTypebox } from '../../../lib/types';
import UserService from '../../../services/UserService';
import {
  loginSchema,
  logoutSchema,
  refreshTokenSchema,
  registerSchema,
} from './schema';

const authRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  const userService = UserService.getInstance();

  /**
   * 로그인
   */
  fastify.post('/login', { schema: loginSchema }, async (request, reply) => {
    const authResult = await userService.login(request.body);
    setTokenCookie(reply, authResult.tokens);
    return authResult;
  });

  /**
   * 회원가입
   */
  fastify.post(
    '/register',
    { schema: registerSchema },
    async (request, reply) => {
      const authResult = await userService.register(request.body);
      setTokenCookie(reply, authResult.tokens);
      return authResult;
    },
  );

  /**
   * 토큰 재발급
   */
  fastify.post(
    '/refresh',
    {
      schema: refreshTokenSchema,
    },
    async (request, reply) => {
      const refreshToken =
        request.body.refreshToken ?? request.cookies.refresh_token;

      if (!refreshToken) {
        throw new AppError('BadrequestError');
      }

      const tokens = await userService.refreshToken(refreshToken);
      setTokenCookie(reply, tokens);
      return tokens;
    },
  );

  /**
   * 로그아웃
   */
  fastify.post(
    '/logout',
    {
      schema: logoutSchema,
    },
    async (request, reply) => {
      clearCookie(reply);
      reply.status(204);
    },
  );
};

export default authRoute;
