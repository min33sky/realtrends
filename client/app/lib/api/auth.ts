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
 * 토근 재발급
 */
export async function refreshToken() {
  //? {}를 빼면# 415 Error가 발생한다...
  const response = await client.post<Tokens>('/api/auth/refresh', {});
  const tokens = response.data;
  const cookieHeader = response.headers['set-cookie'];
  const headers = createCookieHeader(cookieHeader);
  return {
    tokens,
    headers,
  };
}

/**
 * 로그아웃
 */
export async function logout() {
  return client.post('/api/auth/logout');
}

/**
 * ### Response Header에 Set-Cookie를 설정하는 함수
 * Backend에서 Set-Cookie로 전달한 Cookie를 Frontend로 그대로 전달하기 위해서 사용한다.
 * @param setCookieHeader cookie array
 * @returns header
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
