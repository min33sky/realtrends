import { Static, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import { type } from 'os';
import { createAppErrorSchema } from '../../../lib/AppError';
import { createRouteSchema, RoutesType } from '../../../lib/routeSchema';
import { UserSchema } from '../../../schema/userSchema';

export const AuthBody = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export type AuthBodyType = Static<typeof AuthBody>;

const TokensSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

const AuthResult = Type.Object({
  user: UserSchema,
  tokens: TokensSchema,
});

export const AuthRouteSchema = createRouteSchema({
  Register: {
    tags: ['auth'],
    body: AuthBody,
    response: {
      200: AuthResult,
      409: createAppErrorSchema({
        statusCode: 409,
        name: 'UserExistsError',
        message: 'User already exists',
      }),
    },
  },
  Login: {
    tags: ['auth'],
    body: AuthBody,
    response: {
      200: AuthResult,
      401: createAppErrorSchema({
        statusCode: 401,
        name: 'AuthenticationError',
        message: 'Invalid username or password',
      }),
    },
  },
  RefreshToken: {
    tags: ['auth'],
    body: Type.Object({
      refreshToken: Type.String(),
    }),
    response: {
      200: TokensSchema,
      401: createAppErrorSchema({
        name: 'RefreshTokenError',
        message: 'Failed to refresh token',
        statusCode: 401,
      }),
    },
  },
  Logout: {
    tags: ['auth'],
    response: {
      200: Type.Null(),
    },
  },
});

export type AuthRoute = RoutesType<typeof AuthRouteSchema>;
