import { Static, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import { createAppErrorSchema } from '../../../lib/AppError';
import { UserSchema } from '../../../schema/userSchema';

export const AuthBody = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

export type AuthBodyType = Static<typeof AuthBody>;

const authResultSchema = {
  type: 'object',
  properties: {
    tokens: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
    user: UserSchema,
  },
};

// const authBodySchema = {
//   type: 'object',
//   properties: {
//     username: {
//       type: 'string',
//     },
//     password: {
//       type: 'string',
//     },
//   },
//   required: ['username', 'password'],
// };

export const registerSchema: FastifySchema = {
  body: AuthBody,
  response: {
    200: authResultSchema,
    409: createAppErrorSchema({
      statusCode: 409,
      name: 'UserExistsError',
      message: 'User already exists',
    }),
  },
};

export const loginSchema: FastifySchema = {
  body: AuthBody,
  response: {
    200: authResultSchema,
    401: createAppErrorSchema({
      statusCode: 401,
      name: 'AuthenticationError',
      message: 'Invalid username or password',
    }),
  },
};

export const refreshTokenSchema: FastifySchema = {
  body: {
    type: 'object',
    properties: {
      refreshToken: { type: 'string' },
    },
  },
};
