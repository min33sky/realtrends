type ErrorName =
  | 'UserExistsError'
  | 'AuthenticationError'
  | 'UnknownError'
  | 'UnauthorizedError'
  | 'BadrequestError'
  | 'RefreshTokenError'
  | 'NotFoundError'
  | 'ForbiddenError';

type ErrorInfo = {
  statusCode: number;
  message: string;
};

interface ErrorPayloads {
  UserExistsError: undefined;
  AuthenticationError: undefined;
  UnknownError: undefined;
  UnauthorizedError: {
    isExpiredToken: boolean;
  };
  BadrequestError: undefined;
  RefreshTokenError: undefined;
  NotFoundError: undefined;
  ForbiddenError: undefined;
}

const statusCodeMap: Record<ErrorName, ErrorInfo> = {
  UserExistsError: {
    statusCode: 409,
    message: 'User already exists',
  },
  AuthenticationError: {
    statusCode: 401,
    message: 'Invalid username or password',
  },
  UnknownError: {
    statusCode: 500,
    message: 'Unknown error',
  },
  UnauthorizedError: {
    statusCode: 401,
    message: 'Unauthorized',
  },
  BadrequestError: {
    statusCode: 400,
    message: 'Bad request',
  },
  RefreshTokenError: {
    statusCode: 401,
    message: 'Refresh token error',
  },
  NotFoundError: {
    statusCode: 404,
    message: 'Not found',
  },
  ForbiddenError: {
    statusCode: 403,
    message: 'Forbidden',
  },
};

export default class AppError extends Error {
  public statusCode: number;

  constructor(
    public name: ErrorName,
    public payload?: ErrorPayloads[ErrorName],
  ) {
    const info = statusCodeMap[name];
    super(info.message);
    this.statusCode = info.statusCode;
  }
}

/**
 * AppError 인스턴스인지 확인
 * @param error
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export const appErrorSchema = {
  type: 'object',
  properties: {
    statusCode: {
      type: 'number',
    },
    name: {
      type: 'string',
    },
    message: {
      type: 'string',
    },
  },
};

export function createAppErrorSchema<T, S>(example: T, payloadScehma?: S) {
  return {
    type: 'object',
    properties: {
      ...appErrorSchema.properties,
      ...(payloadScehma ? { payload: payloadScehma } : {}), //? TIP: 값에 undefined도 있으면 안될 경우에 사용하는 꼼수
    },
    example,
  };
}
