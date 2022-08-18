import { FastifyPluginAsync } from 'fastify';
import UserService from '../../../services/UserService';
import { AuthBody } from '../../../types';
import { loginSchema, registerSchema } from './schema';

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance();

  fastify.post<{ Body: AuthBody }>(
    '/login',
    { schema: loginSchema },
    async (fastify) => {
      return await userService.login(fastify.body);
    }
  );

  fastify.post<{ Body: AuthBody }>(
    '/register',
    { schema: registerSchema },
    async (request) => {
      return await userService.register(request.body);
    }
  );
};

export default authRoute;
