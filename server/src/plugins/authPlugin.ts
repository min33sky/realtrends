import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import { AccessTokenPayload, validateToken } from '../lib/tokens';

const { JsonWebTokenError } = jwt;

const authPluginAsync: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('user', null);
  fastify.decorateRequest('isExpiredToken', false);

  fastify.addHook('preHandler', async (request, reply) => {
    //? header 혹은 cookie에서 access_token을 가져온다.
    const token =
      request.headers.authorization?.split('Bearer ')[1] ??
      request.cookies.access_token;

    //? refresh_token은 존재하나 access_token이 존재하지 않을 땐 토큰이 만료된 것이다.
    if (request.cookies.refresh_token && !token) {
      request.isExpiredToken = true;
      return;
    }

    if (!token) {
      console.log('##### 인증 토큰이 존재하지 않습니다... #####');
      return;
    }

    console.log('Token:', token);

    //? 토큰 검증
    try {
      const decoded = await validateToken<AccessTokenPayload>(token);
      request.user = {
        id: decoded.userId,
        username: decoded.username,
      };
    } catch (error: any) {
      if (error instanceof JsonWebTokenError) {
        if (error.name === 'TokenExpiredError') {
          request.isExpiredToken = true;
        }
      }
    }
  });
};

export const authPlugin = fp(authPluginAsync, {
  name: 'authPlugin',
});

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: number;
      username: string;
    } | null;
    isExpiredToken: boolean;
  }

  // interface FastifyReply {
  //   myPluginProp: number
  // }
}
