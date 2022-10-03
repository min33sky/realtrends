import { Type } from '@sinclair/typebox';
import { createAppErrorSchema } from '../../../lib/AppError';
import { routesSchema } from '../../../lib/routeSchema';
import { UserSchema } from '../../../schema/userSchema';

const UnAuthorizedErrorSchema = createAppErrorSchema(
  {
    name: 'UnauthorizedError',
    message: 'Unauthorized',
    statusCode: 401,
    payload: {
      isExpiredToken: true,
    },
  },
  Type.Object({
    isExpiredToken: Type.Boolean(),
  }),
);

export const getAccountSchema = routesSchema({
  tags: ['me'],
  response: {
    200: UserSchema,
    401: UnAuthorizedErrorSchema,
  },
});

export const updatePasswordSchema = routesSchema({
  tags: ['me'],
  body: Type.Object({
    oldPassword: Type.String(),
    newPassword: Type.String(),
  }),
  response: {
    200: UserSchema,
    401: UnAuthorizedErrorSchema,
    403: createAppErrorSchema({
      name: 'Forbidden',
      message: 'Password does not match',
      statusCode: 403,
    }),
  },
});

export const unregisterSchema = routesSchema({
  tags: ['me'],
  response: {
    204: Type.Null(),
  },
});
