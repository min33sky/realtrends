//? AppError를 Refactory 하는 중....

const errors = {
  UserExists: {
    statusCode: 409,
    message: 'User already exists',
  },
  WrongCredentials: {
    statusCode: 401,
    message: 'Invalid username or password',
  },
  Unknown: {
    statusCode: 500,
    message: 'Unknown error',
  },
  Unauthorized: {
    statusCode: 401,
    message: 'Unauthorized',
  },
  BadRequest: {
    statusCode: 400,
    message: 'Bad Request',
  },
  RefreshFailure: {
    statusCode: 401,
    message: 'Failed to refresh token',
  },
  NotFound: {
    statusCode: 404,
    message: 'Not Found',
  },
  Forbidden: {
    statusCode: 403,
    message: 'Forbidden',
  },
};

type ErrorName = keyof typeof errors;

interface ErrorPayload {
  Unauthorized: {
    isExpiredToken: boolean;
  };
  BadRequest: any;
}

//? 모든 에러에 대한 payload를 undeifnd로 설정하고,
//? ErrorPayload가 존재하는 에러는 Omit으로 제거하고 payload가 있는 타입으로 바꿔치기한다.
type ErrorPayloadWithDefault = Omit<
  Record<ErrorName, undefined>,
  keyof ErrorPayload
> &
  ErrorPayload;

export default class AppError extends Error {
  public statusCode: number;

  constructor(
    public name: ErrorName,
    public payload: ErrorPayloadWithDefault[ErrorName],
  ) {
    const errorInfo = errors[name];
    super(errorInfo.message);
    this.statusCode = errorInfo.statusCode;
  }
}
