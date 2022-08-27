import { FastifyPluginAsync } from 'fastify';
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin';
import ItemService from '../../../services/ItemService';
import {
  GetItemRoute,
  GetItemSchema,
  GetItemsRoute,
  WriteItemRoute,
  WriteItemSchema,
} from './schema';

export const itemRoute: FastifyPluginAsync = async (fastify) => {
  const itemService = ItemService.getInstance();

  fastify.register(authorizedItemRoute);

  fastify.get<GetItemRoute>(
    '/:id',
    { schema: GetItemSchema },
    async (request, reply) => {
      const { id } = request.params;
      const item = await itemService.getItem(id);
      return item;
    },
  );

  // TODO: 스키마 추가해서 타입을 string -> number로 바꿔줘야함
  fastify.get<GetItemsRoute>('/', async (request) => {
    const { cursor } = request.query;
    return itemService.getPublicItems({
      mode: 'recent',
      cursor: cursor ? parseInt(cursor, 10) : undefined,
    });
  });
};

/**
 * 인증이 필요한 라우트
 */
const authorizedItemRoute = createAuthorizedRoute(async (fastify) => {
  const itemService = ItemService.getInstance();

  fastify.post<WriteItemRoute>(
    '/',
    {
      schema: WriteItemSchema,
    },
    async (request) => {
      const item = await itemService.createItem(request.user!.id, request.body); //? 인증 통과했으므로 user는 무조건 존재한다.
      return item;
    },
  );
});
