import type { AuthResult } from './api/auth';
import { getMyAccount } from './api/auth';

//? 인증 정보를 담은 Promise.
//? 인증이 필요한 페이지에서 SSR할 때 사용하기 위해서
let getMyAccountPromise: Promise<AuthResult> | null = null;

export async function getMemoMyAccount() {
  if (!getMyAccountPromise) {
    getMyAccountPromise = getMyAccount();
  }
  return getMyAccountPromise;
}

export const checkIsLoggedIn = async (request: Request) => {
  const cookie = request.headers.get('Cookie');

  if (!cookie || !cookie.includes('access_token')) {
    return false;
  }

  try {
    await getMemoMyAccount();
  } catch (error) {
    console.log({ error });
    return false;
  }

  return true;
};
