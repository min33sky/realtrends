import { Type } from '@sinclair/typebox';
import { createAppErrorSchema } from '../../../lib/AppError';
import { routesSchema } from '../../../lib/routeSchema';
import { UserSchema } from '../../../schema/userSchema';

export const AuthBody = Type.Object({
  username: Type.String(),
  password: Type.String(),
});

const TokensSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
});

const AuthResult = Type.Object({
  user: UserSchema,
  tokens: TokensSchema,
});

export const registerSchema = routesSchema({
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
});

export const loginSchema = routesSchema({
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
});

export const refreshTokenSchema = routesSchema({
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
});

export const logoutSchema = routesSchema({
  tags: ['auth'],
  response: {
    200: Type.Null(),
  },
});
