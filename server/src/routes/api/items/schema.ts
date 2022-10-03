import { Static, Type } from '@sinclair/typebox';
import { PaginationSchema } from '../../../lib/pagination';
import { routesSchema } from '../../../lib/routeSchema';
import { Nullable } from '../../../lib/typebox';
import { UserSchema } from '../../../schema/userSchema';

const ItemStatsSchema = Type.Object({
  id: Type.Integer(),
  likes: Type.Integer(),
  commentsCount: Type.Integer(),
});

ItemStatsSchema.example = {
  id: 1,
  likes: 10,
  commentsCount: 5,
};

export const ItemSchema = Type.Object({
  id: Type.Integer(),
  title: Type.String(),
  body: Type.String(),
  link: Nullable(Type.String()),
  thumbnail: Nullable(Type.String()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  author: Type.String(),
  user: UserSchema,
  publisher: Type.Object({
    id: Type.Integer(),
    name: Type.String(),
    domain: Type.String(),
    favicon: Nullable(Type.String()),
  }),
  ItemStats: ItemStatsSchema,
  isLiked: Type.Boolean(),
  isBookmarked: Type.Boolean(),
});

ItemSchema.example = {
  id: 1,
  title: 'hello world',
  body: 'boooooooooooooooody',
  link: 'https://youtube.com',
  thumbnail: null,
  createdAt: '2022-07-29T14:42:40.827Z',
  updatedAt: '2022-07-29T14:42:40.827Z',
  author: 'authoooooor',
  user: {
    id: 1,
    username: 'minminmin',
  },
  ItemStats: {
    id: 1,
    likes: 10,
  },
  isLiked: false,
};

export type ItemType = Static<typeof ItemSchema>;

export const ItemParamsSchema = Type.Object({
  id: Type.Integer(),
});

const ItemLikeSchema = Type.Object({
  id: Type.Integer(),
  ItemStats: ItemStatsSchema,
  isLiked: Type.Boolean(),
});

ItemLikeSchema.example = {
  id: 1,
  ItemStats: {
    id: 1,
    likes: 1,
  },
  isLiked: true,
};

export const getItemSchema = routesSchema({
  tags: ['item'],
  params: ItemParamsSchema,
  response: {
    200: ItemSchema,
  },
});

export const getItemsSchema = routesSchema({
  tags: ['item'],
  querystring: Type.Object({
    cursor: Type.Optional(Type.String()),
    mode: Type.Optional(
      Type.Union([
        Type.Literal('recent'),
        Type.Literal('trending'),
        Type.Literal('past'),
      ]),
    ),
    startDate: Type.Optional(Type.String()),
    endDate: Type.Optional(Type.String()),
  }),
  response: {
    200: PaginationSchema(ItemSchema),
  },
});

export const writeItemSchema = routesSchema({
  tags: ['item'],
  body: Type.Object({
    title: Type.String(),
    body: Type.String(),
    link: Type.String(),
    tags: Type.Optional(Type.Array(Type.String())),
  }),
  response: {
    200: ItemSchema,
  },
});

export const updateItemSchema = routesSchema({
  tags: ['item'],
  params: ItemParamsSchema,
  body: Type.Object({
    title: Type.String(),
    body: Type.String(),
    tags: Type.Array(Type.String()),
  }),
  response: {
    200: ItemSchema,
  },
});

export const deleteItemSchema = routesSchema({
  tags: ['item'],
  params: ItemParamsSchema,
  response: {
    204: Type.Null(),
  },
});

export const likeItemSchema = routesSchema({
  tags: ['item'],
  params: ItemParamsSchema,
  response: {
    200: ItemLikeSchema,
  },
});

export const unlikeItemSchema = routesSchema({
  tags: ['item'],
  params: ItemParamsSchema,
  response: {
    200: ItemLikeSchema,
  },
});
