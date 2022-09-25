import { createAuthorizedRoute } from '../../../plugins/requireAuthPlugin';
import BookmarkService from '../../../services/BookmarkService';
import { BookmarksRoute, BookmarksRouteSchema } from './schema';

export const bookmarksRoute = createAuthorizedRoute(async (fastify) => {
  const bookmarkService = BookmarkService.getInstance();

  fastify.post<BookmarksRoute['CreateBookmark']>(
    '/',
    {
      schema: BookmarksRouteSchema.CreateBookmark,
    },
    async (request) => {
      const { itemId } = request.body;
      const userId = request.user!.id;
      const bookmark = await bookmarkService.createBookmark({ itemId, userId });
      console.log('시ㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ발');
      return bookmark;
    },
  );

  fastify.get<BookmarksRoute['GetBookmarks']>(
    '/',
    {
      schema: BookmarksRouteSchema.GetBookmarks,
    },
    async (request) => {
      const { cursor } = request.query;
      const userId = request.user!.id;
      const bookmarks = await bookmarkService.getBookmarks({
        userId,
        cursor,
        limit: 5,
      });
      return bookmarks;
    },
  );

  fastify.delete<BookmarksRoute['DeleteBookmark']>(
    '/',
    {
      schema: BookmarksRouteSchema.DeleteBookmark,
    },
    async (request, reply) => {
      const { itemId } = request.query;
      const userId = request.user!.id!;
      await bookmarkService.deleteBookmark({ itemId, userId });
      reply.status(204);
    },
  );
});
