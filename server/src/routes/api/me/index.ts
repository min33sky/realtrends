import { FastifyPluginAsync } from 'fastify';
import { clearCookie } from '../../../lib/cookies';
import requireAuthPlugin from '../../../plugins/requireAuthPlugin';
import UserService from '../../../services/UserService';
import { MeRoute, MeRouteSchema } from './schema';

export const meRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance();

  //? meRoute에서만 적용할 인증 Route Plugin을 설정
  fastify.register(requireAuthPlugin);

  fastify.get<MeRoute['GetAccount']>(
    '/',
    { schema: MeRouteSchema.GetAccount },
    async (request) => {
      return request.user;
    },
  );

  fastify.post<MeRoute['UpdatePassword']>(
    '/password',
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
