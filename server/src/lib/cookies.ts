import { FastifyReply } from 'fastify';

/**
 * 쿠키에 인증 토큰을 설정하는 함수
 * @param reply
 * @param tokens accessToken, refreshToken를 담은 객체
 */
export function setTokenCookie(
  reply: FastifyReply,
  tokens: { accessToken: string; refreshToken: string },
) {
  reply.setCookie('access_token', tokens.accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60), // 1시간
    path: '/', //? 쿠키 사용범위를 앱 전역으로 설정
  });

  reply.setCookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1주일
    path: '/',
  });
}

export function clearCookie(reply: FastifyReply) {
  reply.clearCookie('access_token');
  reply.clearCookie('refresh_token');
}
