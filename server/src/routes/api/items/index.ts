import { FastifyPluginAsync } from 'fastify';
import { FastifyPluginAsyncTypebox } from '../../../lib/types';
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin';
import ItemService from '../../../services/ItemService';
import { commentsRoute } from './comments';
import {
  deleteItemSchema,
  getItemSchema,
  getItemsSchema,
  likeItemSchema,
  unlikeItemSchema,
  updateItemSchema,
  writeItemSchema,
} from './schema';

export const itemRoute: FastifyPluginAsyncTypebox = async (fastify) => {
  const itemService = ItemService.getInstance();

  fastify.register(authorizedItemRoute); //? 인증된 사용자만 접근 가능한 라우트
  fastify.register(commentsRoute, { prefix: '/:id/comments' }); //? 해당 글에대한 댓글 라우트

  fastify.get('/:id', { schema: getItemSchema }, async (request) => {
    const { id } = request.params;
    const userId = request.user?.id;
    const item = await itemService.getItem(id, userId);
    return item as any;
  });

  fastify.get('/', { schema: getItemsSchema }, async (request) => {
    const { cursor, mode, endDate, startDate } = request.query;

    return itemService.getItems({
      mode: mode ?? 'recent',
      cursor: cursor ? parseInt(cursor, 10) : undefined,
      userId: request.user?.id,
      limit: 20,
      startDate,
      endDate,
    }) as any;
  });
};

/**
 ** 인증이 필요한 Protcted Routes
 */
const authorizedItemRoute = createAuthorizedRoute(async (fastify) => {
  const itemService = ItemService.getInstance();

  /**
   * 게시물 등록하기
   */
  fastify.post(
    '/',
    {
      schema: writeItemSchema,
    },
    async (request) => {
      const item = await itemService.createItem(request.user!.id, request.body); //? 인증 통과했으므로 user는 무조건 존재한다.
      return item as any;
    },
  );

  /**
   * 게시물 수정하기
   */
  fastify.patch('/:id', { schema: updateItemSchema }, async (request) => {
    const { id: itemId } = request.params;
    const userId = request.user!.id;

    const { title, body } = request.body;

    return itemService.updateItem({
      itemId,
      userId,
      title,
      body,
    }) as any;
  });

  /**
   * 게시물 삭제하기
   */
  fastify.delete(
    '/:id',
    { schema: deleteItemSchema },
    async (request, reply) => {
      const { id: itemId } = request.params;
      const userId = request.user!.id;

      await itemService.deleteItem({ itemId, userId });
      return reply.status(204).send();
    },
  );

  /**
   * 좋아요
   */
  fastify.post(
    '/:id/likes',
    { schema: likeItemSchema },
    async (request, reply) => {
      const { id: itemId } = request.params;
      const userId = request.user!.id;
      const itemStats = await itemService.likeItem({ itemId, userId });
      return {
        id: itemId,
        ItemStats: itemStats,
        isLiked: true,
      };
    },
  );

  /**
   * 좋아요 취소
   */
  fastify.delete(
    '/:id/likes',
    {
      schema: unlikeItemSchema,
    },
    async (request, reply) => {
      const { id: itemId } = request.params;
      const userId = request.user!.id;
      const itemStats = await itemService.unLikeItem({ itemId, userId });
      return { id: itemId, ItemStats: itemStats, isLiked: false };
    },
  );
});
