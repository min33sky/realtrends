import { FastifySchema } from 'fastify';
import { createAppErrorSchema } from '../../../lib/AppError';
import { UserSchema } from '../../../schema/userSchema';

export const getMeSchema: FastifySchema = {
  tags: ['me'],
  response: {
    200: UserSchema,
    401: createAppErrorSchema(
      {
        statusCode: 401,
        name: 'UnauthorizedError',
        message: 'Unauthorized',
        payload: {
          isExpiredToken: true,
        },
      },
      {
        type: 'object',
        properties: {
          isExpiredToken: {
            type: 'boolean',
          },
        },
      },
    ),
  },
};
