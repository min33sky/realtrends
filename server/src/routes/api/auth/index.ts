import { FastifyPluginAsync, FastifyReply } from 'fastify';
import AppError from '../../../lib/AppError';
import requireAuthPlugin from '../../../plugins/requireAuthPlugin';
import UserService from '../../../services/UserService';
import {
  AuthBodyType,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from './schema';

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance();

  //????????????????????????? 특정 Endpoint만 plugin 적용 테스트용
  fastify.register(async (_fastify, opts) => {
    _fastify.register(requireAuthPlugin);
    _fastify.get('/test', async (request, reply) => {
      return {
        message: 'Hello World!',
      };
    });
  });

  /**
   * 로그인
   */
  fastify.post<{ Body: AuthBodyType }>(
    '/login',
    { schema: loginSchema },
    async (request, reply) => {
      const authResult = await userService.login(request.body);

      setTokenCookie(reply, authResult.tokens);

      return authResult;
    },
  );

  /**
   * 회원가입
   */
  fastify.post<{ Body: AuthBodyType }>(
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
  fastify.post<{ Body: { refreshToken: string } }>(
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
   * 쿠키 설정
   * @param reply
   * @param tokens
   */
  function setTokenCookie(
    reply: FastifyReply,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    reply.setCookie('access_token', tokens.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60), // 1시간
      path: '/', //? 쿠키 사용범위를 앱 전역으로 설정
    });
    reply.setCookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1주일
      path: '/',
    });
  }
};

export default authRoute;
