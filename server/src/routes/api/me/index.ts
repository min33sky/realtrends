import { FastifyPluginAsync } from 'fastify';
import { clearCookie } from '../../../lib/cookies';
import requireAuthPlugin from '../../../plugins/requireAuthPlugin';
import UserService from '../../../services/UserService';
import { MeRoute, MeRouteSchema } from './schema';

export const meRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance();

  //? meRoute에서만 적용할 인증 필수 Route Plugin을 설정
  fastify.register(requireAuthPlugin);

  /**
   * 내 정보 조회
   */
  fastify.get<MeRoute['GetAccount']>(
    '/',
    { schema: MeRouteSchema.GetAccount },
    async (request) => {
      return request.user;
    },
  );

  /**
   * 비밀번호 변경
   */
  fastify.post<MeRoute['UpdatePassword']>(
    '/change-password',
    { schema: MeRouteSchema.UpdatePassword },
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
  fastify.delete<MeRoute['Unregister']>(
    '/',
    { schema: MeRouteSchema.Unregister },
    async (request, reply) => {
      await userService.unregister(request.user!.id);
      reply.status(204);
      clearCookie(reply);
    },
  );
};
