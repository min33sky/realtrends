import axios from 'axios';
import { client } from '../client';

export async function register(params: AuthParams) {
  const response = await axios.post<AuthResult>(
    'http://localhost:4000/api/auth/register',
    params,
  );

  const result = response.data;
  const cookieHeader = response.headers['set-cookie'];

  const headers = createCookieHeader(cookieHeader);

  return {
    result,
    headers,
  };
}

export async function login(params: AuthParams) {
  const response = await axios.post<AuthResult>(
    'http://localhost:4000/api/auth/login',
    params,
  );

  const result = response.data;
  const cookieHeader = response.headers['set-cookie'];

  const headers = createCookieHeader(cookieHeader);

  return {
    result,
    headers,
  };
}

/**
 * 내 정보 조회
 */
export async function getMyAccount() {
  const response = await client.get<AuthResult>('http://localhost:4000/api/me');
  return response.data;
}

/**
 * Response Header에 Set-Cookie를 설정하는 함수
 * ? Backend에서 Set-Cookie로 전달한 Cookie를 Frontend로 그대로 전달하기 위해서 사용한다.
 * @param setCookieHeader cookie array
 */
function createCookieHeader(setCookieHeader: string[] | undefined) {
  if (!setCookieHeader || setCookieHeader?.length === 0) {
    throw new Error('No cookie header');
  }

  const headers = new Headers();

  setCookieHeader.forEach((cookie) => {
    headers.append('Set-Cookie', cookie);
  });

  return headers;
}

// Generated by https://quicktype.io

interface AuthParams {
  username: string;
  password: string;
}

export interface AuthResult {
  tokens: Tokens;
  user: User;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  username: string;
}
