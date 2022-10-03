import { clearCookie } from '../../../lib/cookies';
import { FastifyPluginAsyncTypebox } from '../../../lib/types';
import requireAuthPlugin from '../../../plugins/requireAuthPlugin';
import UserService from '../../../services/UserService';
import {
  getAccountSchema,
  unregisterSchema,
  updatePasswordSchema,
} from './schema';

export const meRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  const userService = UserService.getInstance();

  //? meRoute에서만 적용할 인증 필수 Route Plugin을 설정
  fastify.register(requireAuthPlugin);

  /**
   * 내 정보 조회
   */
  fastify.get('/', { schema: getAccountSchema }, async (request) => {
    //? 인증 정보가 없으면 plugin에서 Error를 반환하기 때문에
    //? 여기서 user는 항상 존재하는 상태이다. 그래서 !를 붙여준다.
    return request.user!;
  });

  /**
   * 비밀번호 변경
   */
  fastify.post(
    '/change-password',
    { schema: updatePasswordSchema },
    async (request, reply) => {
      const { oldPassword, newPassword } = request.body;
      await userService.changePassword({
        userId: request.user!.id,
        oldPassword,
        newPassword,
      });

      reply.status(204);
    },
  );

  /**
   * 회원 탈퇴
   */
  fastify.delete('/', { schema: unregisterSchema }, async (request, reply) => {
    await userService.unregister(request.user!.id);
    reply.status(204);
    clearCookie(reply);
  });
};
