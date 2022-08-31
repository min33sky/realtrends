import { setClientCookie } from './client';

export function applyAuth(request: Request) {
  const cookie = request.headers.get('Cookie');

  if (!cookie || !cookie.includes('access_token')) {
    return false;
  }

  //? Root에서 쿠키를 설정해도 Context마다 초기화 되므로
  //? Axios 요청을 위한 쿠키를 다시 설정해줘야 되는것 같다.
  setClientCookie(cookie);

  return true;
}
