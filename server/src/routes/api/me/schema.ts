import { FastifySchema } from 'fastify';
import { createAppErrorSchema } from '../../../lib/AppError';
import { userSchema } from '../../../schema/userSchema';

export const getMeSchema: FastifySchema = {
  response: {
    200: userSchema,
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
      }
    ),
  },
};
