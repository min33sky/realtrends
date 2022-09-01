import { Static, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import { PaginationSchema } from '../../../lib/pagination';
import { Nullable } from '../../../lib/typebox';
import { UserSchema } from '../../../schema/userSchema';

const CreateItemSchema = Type.Object({
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  tags: Type.Optional(Type.Array(Type.String())),
});

export type CreateItemBodyType = Static<typeof CreateItemSchema>;

const ItemSchema = Type.Object({
  id: Type.Integer(),
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
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
};

export const WriteItemSchema: FastifySchema = {
  tags: ['items'],
  body: CreateItemSchema,
  response: {
    200: ItemSchema,
  },
};

export interface WriteItemRoute {
  Body: CreateItemBodyType;
}

const ItemParamsSchema = Type.Object({
  id: Type.Integer(),
});

type ItemParamsType = Static<typeof ItemParamsSchema>;

const UpdateItemBodySchema = Type.Object({
  title: Type.String(),
  body: Type.String(),
  tags: Type.Array(Type.String()),
});

type UpdateItemBodyType = Static<typeof UpdateItemBodySchema>;

export const GetItemSchema: FastifySchema = {
  tags: ['items'],
  params: ItemParamsSchema,
  response: {
    200: ItemSchema,
  },
};

export const GetItemsSchema: FastifySchema = {
  tags: ['items'],
  response: {
    200: PaginationSchema(ItemSchema),
  },
};

export const UpdateItemSchema: FastifySchema = {
  tags: ['items'],
  params: ItemParamsSchema,
  body: UpdateItemBodySchema,
  response: {
    200: ItemSchema,
  },
};

export const DeleteItemSchema: FastifySchema = {
  tags: ['items'],
  params: ItemParamsSchema,
  response: {
    204: Type.Null(),
  },
};

export interface GetItemRoute {
  Params: ItemParamsType;
}

export interface GetItemsRoute {
  Querystring: {
    cursor?: string;
  };
}

export interface UpdateItemRoute {
  Params: ItemParamsType;
  Body: UpdateItemBodyType;
}

export interface DeleteItemRoute {
  Params: ItemParamsType;
}
