import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin';
import BookmarkService from '../../../services/BookmarkService';
import {
  createBookmarkSchema,
  deleteBookmarkSchema,
  getBookmarksSchema,
} from './schema';

export const bookmarksRoute = createAuthorizedRoute(async (fastify) => {
  const bookmarkService = BookmarkService.getInstance();

  fastify.post(
    '/',
    {
      schema: createBookmarkSchema,
    },
    async (request) => {
      const { itemId } = request.body;
      const userId = request.user!.id;
      const bookmark = await bookmarkService.createBookmark({ itemId, userId });
      return bookmark as any;
    },
  );

  fastify.get(
    '/',
    {
      schema: getBookmarksSchema,
    },
    async (request) => {
      const { cursor } = request.query;
      const userId = request.user!.id;
      const bookmarks = await bookmarkService.getBookmarks({
        userId,
        cursor,
        limit: 5,
      });
      return bookmarks as any;
    },
  );

  fastify.delete(
    '/',
    {
      schema: deleteBookmarkSchema,
    },
    async (request, reply) => {
      const { itemId } = request.query;
      const userId = request.user!.id!;
      await bookmarkService.deleteBookmark({ itemId, userId });
      reply.status(204);
    },
  );
});
