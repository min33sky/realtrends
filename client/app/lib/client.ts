import axios from 'axios';

export const client = axios.create();
client.defaults.baseURL = 'http://localhost:4000';

export function setClientCookie(cookie: string) {
  client.defaults.headers.common['Cookie'] = cookie;
}

/**
 *? Remix에서는 페이지에 요청할 때마다 (새로고침) 자바스크립트 컨텍스트가
 *? 초기화가 되는거 같다. 그래서 설정한 쿠키를 따로 지워줄 필요가 없는거 같아서
 *? 이 함수는 사용할 필요가 없다.
 */
export function clearClientCookie() {
  delete client.defaults.headers.common['Cookie'];
}
