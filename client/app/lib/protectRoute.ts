import type { AuthResult } from './api/auth';
import { getMyAccount } from './api/auth';
import { applyAuth } from './applyAuth';
import { setClientCookie } from './client';

//? 인증 정보를 담은 Promise.
//? 인증이 필요한 페이지에서 SSR할 때 사용하기 위해서
let getMyAccountPromise: Promise<AuthResult> | null = null;

export async function getMemoMyAccount() {
  if (!getMyAccountPromise) {
    getMyAccountPromise = getMyAccount();
  }

  return getMyAccountPromise;
}

/**
 * 사용자 인증 정보를 확인하는 함수
 * @param request
 * @returns boolean
 */
export const checkIsLoggedIn = async (request: Request) => {
  const applied = applyAuth(request);
  if (!applied) return false;

  try {
    await getMemoMyAccount();
  } catch (error) {
    console.log({ error });
    return false;
  }

  return true;
};
