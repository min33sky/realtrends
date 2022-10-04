import type { AuthResult } from './api/auth';
import { refreshToken } from './api/auth';
import { getMyAccount } from './api/me';
import { applyAuth } from './applyAuth';
import { setClientCookie } from './client';
import { extractError } from './error';

//? 인증 정보를 담은 Promise.
//? 인증이 필요한 페이지를 SSR할 때 사용하기 위해서
let getMyAccountPromise: Promise<{
  me: AuthResult;
  headers: Headers | null;
}> | null = null;

async function getMyAccountWithRefresh() {
  try {
    const me = await getMyAccount();
    return {
      me,
      headers: null,
    };
  } catch (e) {
    const error = extractError(e);
    if (error.name === 'UnauthorizedError' && error.payload?.isExpiredToken) {
      try {
        const { tokens, headers } = await refreshToken();
        setClientCookie(`access_token=${tokens.accessToken}`);
        const me = await getMyAccount();
        return {
          me,
          headers,
        };
      } catch (innerError) {
        throw e;
      }
    }
    throw e;
  }
}

export async function getMemoMyAccount() {
  if (!getMyAccountPromise) {
    getMyAccountPromise = getMyAccountWithRefresh();
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
