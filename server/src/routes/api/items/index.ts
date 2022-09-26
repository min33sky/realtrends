import { FastifyPluginAsync } from 'fastify';
import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin';
import ItemService from '../../../services/ItemService';
import { commentsRoute } from './comments';
import { ItemsRoute, ItemsRouteScehma } from './schema';

export const itemRoute: FastifyPluginAsync = async (fastify) => {
  const itemService = ItemService.getInstance();

  fastify.register(authorizedItemRoute); //? 인증된 사용자만 접근 가능한 라우트
  fastify.register(commentsRoute, { prefix: '/:id/comments' }); //? 해당 글에대한 댓글 라우트

  fastify.get<ItemsRoute['GetItem']>(
    '/:id',
    { schema: ItemsRouteScehma.GetItem },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user?.id;
      const item = await itemService.getItem(id, userId);
      return item;
    },
  );

  fastify.get<ItemsRoute['GetItems']>(
    '/',
    { schema: ItemsRouteScehma.GetItems },
    async (request) => {
      const { cursor, mode, endDate, startDate } = request.query;

      return itemService.getItems({
        mode: mode ?? 'recent',
        cursor: cursor ? parseInt(cursor, 10) : undefined,
        userId: request.user?.id,
        limit: 20,
        startDate,
        endDate,
      });
    },
  );
};

/**
 ** 인증이 필요한 Protcted Routes
 */
const authorizedItemRoute = createAuthorizedRoute(async (fastify) => {
  const itemService = ItemService.getInstance();

  /**
   * 게시물 등록하기
   */
  fastify.post<ItemsRoute['WriteItem']>(
    '/',
    {
      schema: ItemsRouteScehma.WriteItem,
    },
    async (request) => {
      const item = await itemService.createItem(request.user!.id, request.body); //? 인증 통과했으므로 user는 무조건 존재한다.
      return item;
    },
  );

  /**
   * 게시물 수정하기
   */
  fastify.patch<ItemsRoute['UpdateItem']>(
    '/:id',
    { schema: ItemsRouteScehma.UpdateItem },
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
  fastify.delete<ItemsRoute['DeleteItem']>(
    '/:id',
    { schema: ItemsRouteScehma.DeleteItem },
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
  fastify.post<ItemsRoute['LikeItem']>(
    '/:id/likes',
    { schema: ItemsRouteScehma.LikeItem },
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
  fastify.delete<ItemsRoute['UnlikeItem']>(
    '/:id/likes',
    {
      schema: ItemsRouteScehma.UnlikeItem,
    },
    async (request, reply) => {
      const { id: itemId } = request.params;
      const userId = request.user!.id;
      const itemStats = await itemService.unLikeItem({ itemId, userId });
      return { id: itemId, ItemStats: itemStats, isLiked: false };
    },
  );
});
