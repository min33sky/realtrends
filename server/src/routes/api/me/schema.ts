import { Type } from '@sinclair/typebox';
import { createAppErrorSchema } from '../../../lib/AppError';
import { createRouteSchema, RoutesType } from '../../../lib/routeSchema';
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

export const MeRouteSchema = createRouteSchema({
  GetAccount: {
    tags: ['me'],
    response: {
      200: UserSchema,
      401: UnAuthorizedErrorSchema,
    },
  },
  UpdatePassword: {
    tags: ['me'],
    body: Type.Object({
      oldPassword: Type.String(),
      newPassword: Type.String(),
    }),
    response: {
      204: Type.Null(),
      401: UnAuthorizedErrorSchema,
      403: createAppErrorSchema({
        name: 'Forbidden',
        message: 'Password does not match',
        statusCode: 403,
      }),
    },
  },
  Unregister: {
    tags: ['me'],
    response: {
      204: Type.Null(),
    },
  },
});

export type MeRoute = RoutesType<typeof MeRouteSchema>;
