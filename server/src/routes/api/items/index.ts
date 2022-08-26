import { FastifyPluginAsync } from 'fastify';
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin';
import ItemService from '../../../services/ItemService';
import { WriteItemRoute, writeItemSchema } from './schema';

export const itemRoute: FastifyPluginAsync = async (fastify) => {
  fastify.register(authorizedItemRoute);

  fastify.get('/', async () => {
    return 'Hello World!';
  });
};

const authorizedItemRoute = createAuthorizedRoute(async (fastify) => {
  const itemService = ItemService.getInstance();

  fastify.post<WriteItemRoute>(
    '/',
    {
      schema: writeItemSchema,
    },
    async (request) => {
      const item = await itemService.createItem(request.user!.id, request.body); //? 인증 통과했으므로 user는 무조건 존재한다.
      return item;
    },
  );
});
