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

    if (!token) return;

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
