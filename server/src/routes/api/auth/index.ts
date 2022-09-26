import { FastifyPluginAsync, FastifyReply } from 'fastify';
import AppError from '../../../lib/AppError';
import { clearCookie, setTokenCookie } from '../../../lib/cookies';
import UserService from '../../../services/UserService';
import { AuthRoute, AuthRouteSchema } from './schema';

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance();

  /**
   * 로그인
   */
  fastify.post<AuthRoute['Login']>(
    '/login',
    { schema: AuthRouteSchema.Login },
    async (request, reply) => {
      const authResult = await userService.login(request.body);
      setTokenCookie(reply, authResult.tokens);
      return authResult;
    },
  );

  /**
   * 회원가입
   */
  fastify.post<AuthRoute['Register']>(
    '/register',
    { schema: AuthRouteSchema.Register },
    async (request, reply) => {
      const authResult = await userService.register(request.body);
      setTokenCookie(reply, authResult.tokens);
      return authResult;
    },
  );

  /**
   * 토큰 재발급
   */
  fastify.post<AuthRoute['RefreshToken']>(
    '/refresh',
    {
      schema: AuthRouteSchema.RefreshToken,
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
  fastify.post<AuthRoute['Logout']>(
    '/logout',
    {
      schema: AuthRouteSchema.Logout,
    },
    async (request, reply) => {
      clearCookie(reply);
      reply.status(204);
    },
  );
};

export default authRoute;
