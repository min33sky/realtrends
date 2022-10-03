import { Type } from '@sinclair/typebox';
import { PaginationSchema } from '../../../lib/pagination';
import { routesSchema } from '../../../lib/routeSchema';
import { ItemSchema } from '../items/schema';

const BookmarkSchema = Type.Object({
  id: Type.Integer(),
  item: ItemSchema,
  createdAt: Type.String(),
});

export const getBookmarksSchema = routesSchema({
  tags: ['bookmarks'],
  querystring: Type.Object({
    cursor: Type.Optional(Type.Number()),
  }),
  response: {
    200: PaginationSchema(BookmarkSchema),
  },
});

export const createBookmarkSchema = routesSchema({
  tags: ['bookmarks'],
  body: Type.Object({
    itemId: Type.Number(),
  }),
  response: {
    200: BookmarkSchema,
  },
});

export const deleteBookmarkSchema = routesSchema({
  tags: ['bookmarks'],
  querystring: Type.Object({
    itemId: Type.Number(),
  }),
  response: {
    204: Type.Null(),
  },
});
