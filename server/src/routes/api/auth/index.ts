import { FastifyPluginAsync } from 'fastify';
import UserService from '../../../services/UserService.js';
import { AuthBody } from '../../../types.js';
import { loginSchema, registerSchema } from './schema.js';

const authRoute: FastifyPluginAsync = async (fastify) => {
  const userService = UserService.getInstance();

  fastify.post<{ Body: AuthBody }>(
    '/login',
    { schema: loginSchema },
    async (fastify) => {
      return userService.login(fastify.body);
    }
  );

  fastify.post<{ Body: AuthBody }>(
    '/register',
    { schema: registerSchema },
    async (fastify) => {
      const user = await userService.register(fastify.body);
      return {
        user,
      };
    }
  );
};

export default authRoute;
