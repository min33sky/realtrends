import { client } from '../client';
import type { AuthResult } from './auth';

/**
 * 내 정보 조회
 */
export async function getMyAccount() {
  const response = await client.get<AuthResult>('http://localhost:4000/api/me');
  return response.data;
}

/**
 * 비밀번호 변경
 */
export async function changePassword({
  newPassword,
  oldPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  const response = await client.post('/api/me/change-password', {
    oldPassword,
    newPassword,
  });

  return response.data;
}

/**
 * 회원 탈퇴
 */
export async function unregister() {
  const response = await client.delete('/api/me');
  return response.data;
}
