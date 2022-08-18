import { FastifySchema } from 'fastify';
import { createAppErrorSchema } from '../../../lib/AppError';
import { userSchema } from '../../../schema/userSchema';

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
    user: userSchema,
  },
};

const authBodySchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
  },
};

export const registerSchema: FastifySchema = {
  body: authBodySchema,
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
  body: authBodySchema,
  response: {
    200: authResultSchema,
    401: createAppErrorSchema({
      statusCode: 401,
      name: 'AuthenticationError',
      message: 'Invalid username or password',
    }),
  },
};
