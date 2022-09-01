import type { ThrownResponse } from '@remix-run/react';
import { useCatch } from '@remix-run/react';
import axios from 'axios';

type ErrorName =
  | 'UserExistsError'
  | 'AuthenticationError'
  | 'UnknownError'
  | 'UnauthorizedError'
  | 'BadrequestError'
  | 'RefreshTokenError';

interface ErrorPayloads {
  UserExistsError: undefined;
  AuthenticationError: undefined;
  UnknownError: undefined;
  UnauthorizedError: {
    isExpiredToken: boolean;
  };
  BadrequestError: undefined;
  RefreshTokenError: undefined;
}

export interface AppError {
  statusCode: number;
  message: string;
  name: ErrorName;
  payload?: ErrorPayloads[ErrorName];
}

export function isAppError(error: any): error is AppError {
  return (
    error.statusCode !== undefined &&
    error.message !== undefined &&
    error.name !== undefined
  );
}

/**
 * 응답 Error 객체 정보를 분석하는 함수
 * @param error
 */
export function extractError(error: any): AppError {
  //* Fetch할 때 Axios를 사용하므로 Axios의 Error인지 체크한다.
  if (axios.isAxiosError(error)) {
    //? Backend에서 보내 에러 객체와 타입이 일치하면 그대로 리턴한다.
    //? Why? Backend에서 보낸 에러를 그대로 사용하기 위해서
    const data = error.response?.data;
    if (isAppError(data)) {
      return data;
    }
  }

  //* Axios Error가 아니거나 정의한 Error가 아닐 경우에는 500 Error Return
  return {
    statusCode: 500,
    message: 'Unknown error',
    name: 'UnknownError',
  };
}

export function useAppErrorCatch() {
  const caught = useCatch<ThrownResponse<number, AppError>>();
  return caught;
}
