import { FastifyPluginAsync } from 'fastify';
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin';
import ItemService from '../../../services/ItemService';
import {
  DeleteItemRoute,
  DeleteItemSchema,
  GetItemRoute,
  GetItemSchema,
  GetItemsRoute,
  GetItemsSchema,
  UpdateItemRoute,
  UpdateItemSchema,
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

  fastify.get<GetItemsRoute>(
    '/',
    { schema: GetItemsSchema },
    async (request) => {
      const { cursor } = request.query;
      console.log('##### typeof cursor: ', typeof cursor);
      return itemService.getPublicItems({
        mode: 'recent',
        cursor: cursor ? parseInt(cursor, 10) : undefined,
      });
    },
  );
};

/**
 * 인증이 필요한 Protcted Routes
 */
const authorizedItemRoute = createAuthorizedRoute(async (fastify) => {
  const itemService = ItemService.getInstance();

  /**
   * 게시물 등록하기
   */
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

  /**
   * 게시물 수정하기
   */
  fastify.patch<UpdateItemRoute>(
    '/:id',
    { schema: UpdateItemSchema },
    async (request) => {
      const { id: itemId } = request.params;
      const userId = request.user!.id;

      const { title, body } = request.body;

      return itemService.updateItem({
        itemId,
        userId,
        title,
        body,
      });
    },
  );

  /**
   * 게시물 삭제하기
   */
  fastify.delete<DeleteItemRoute>(
    '/:id',
    { schema: DeleteItemSchema },
    async (request, reply) => {
      const { id: itemId } = request.params;
      const userId = request.user!.id;

      await itemService.deleteItem(itemId, userId);
      return reply.status(204).send();
    },
  );
});
