import { Static, Type } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';
import { Nullable } from '../../../lib/typebox';
import { UserSchema } from '../../../schema/userSchema';

const CreateItemSchema = Type.Object({
  title: Type.String(),
  body: Type.String(),
  link: Type.String(),
  tags: Type.Array(Type.String()),
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
  user: UserSchema,
});

ItemSchema.example = {
  id: 1,
  title: 'hello world',
  body: 'boooooooooooooooody',
  link: 'https://youtube.com',
  thumbnail: null,
  createdAt: '2022-07-29T14:42:40.827Z',
  updatedAt: '2022-07-29T14:42:40.827Z',
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

const ReadItemParams = Type.Object({
  id: Type.Integer(),
});

type ReadItemParamsType = Static<typeof ReadItemParams>;

export const GetItemSchema: FastifySchema = {
  tags: ['items'],
  params: ReadItemParams,
  response: {
    200: ItemSchema,
  },
};

export interface GetItemRoute {
  Params: ReadItemParamsType;
}

export interface GetItemsRoute {
  Querystring: {
    cursor?: string; //! number로 바꿔저야함 (Schema 생성 필요)
  };
}
