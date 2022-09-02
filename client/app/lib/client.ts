import axios from 'axios';

export const client = axios.create();
client.defaults.baseURL = 'http://localhost:4000';
client.defaults.withCredentials = true;

/**
 * APi 요청할 때 헤더에 쿠키 설정
 * @param cookie 쿠키 문자열
 */
export function setClientCookie(cookie: string) {
  client.defaults.headers.common['Cookie'] = cookie;
}

/**
 *? Remix에서는 페이지에 요청할 때마다 (ex. 새로고침 등), 자바스크립트 컨텍스트가
 *? 초기화가 되는거 같다. 그래서 이전에 설정한 쿠키를 따로 지워줄 필요가 없다.
 *? 이 함수는 사용할 필요가 없다.
 */
export function clearClientCookie() {
  delete client.defaults.headers.common['Cookie'];
}
