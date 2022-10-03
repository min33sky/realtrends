import { Type } from '@sinclair/typebox';
import { routesSchema } from '../../../../lib/routeSchema';
import { Nullable } from '../../../../lib/typebox';
import { UserSchema } from '../../../../schema/userSchema';
import { ItemParamsSchema } from '../schema';

const CreateCommentBodySchema = Type.Object({
  text: Type.String(),
  parentCommentId: Type.Optional(Nullable(Type.Integer())),
});

const CommentParamsSchema = Type.Object({
  id: Type.Integer(),
  commentId: Type.Integer(),
});

const UpdateCommentBodySchema = Type.Object({
  text: Type.String(),
});

export let CommentSchema = Type.Object({
  id: Type.Integer(),
  text: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  likes: Type.Number(),
  subcommentsCount: Type.Number(),
  user: UserSchema,
  mentionUser: Nullable(UserSchema),
  isDeleted: Type.Boolean(),
  isLiked: Type.Boolean(),
});

//? subcomments에서 CommentSchema 순환 참조 에러가 발생해서 덮어씌우는 방식으로 구현...
CommentSchema = Type.Object({
  id: Type.Integer(),
  text: Type.String(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  likes: Type.Number(),
  subcommentsCount: Type.Number(),
  user: UserSchema,
  mentionUser: Nullable(UserSchema),
  subcomments: Type.Optional(Type.Array(CommentSchema)), //! 위에 선언으로 이동시키면 순환 참조 에러 발생
  isDeleted: Type.Boolean(),
  isLiked: Type.Boolean(),
});

const CommentLikeSchema = Type.Object({
  id: Type.Integer(),
  likes: Type.Number(),
});

export const getCommentsSchema = routesSchema({
  tags: ['comments'],
  params: ItemParamsSchema,
  response: {
    200: Type.Array(CommentSchema),
  },
});

export const getCommentSchema = routesSchema({
  tags: ['comments'],
  params: CommentParamsSchema,
  response: {
    200: CommentSchema,
  },
});

export const getSubCommentsSchema = routesSchema({
  tags: ['comments'],
  params: CommentParamsSchema,
  response: {
    200: Type.Array(CommentSchema),
  },
});

export const createCommentSchema = routesSchema({
  tags: ['comments'],
  params: ItemParamsSchema,
  body: CreateCommentBodySchema,
  response: {
    200: CommentSchema,
  },
});

export const likeCommentSchema = routesSchema({
  tags: ['comments'],
  params: CommentParamsSchema,
  response: {
    200: CommentLikeSchema,
  },
});

export const unlikeCommentSchema = routesSchema({
  tags: ['comments'],
  params: CommentParamsSchema,
  response: {
    200: CommentLikeSchema,
  },
});

export const updateCommentSchema = routesSchema({
  tags: ['comments'],
  params: CommentParamsSchema,
  body: UpdateCommentBodySchema,
  response: {
    200: CommentSchema,
  },
});

export const deleteCommentSchema = routesSchema({
  tags: ['comments'],
  params: CommentParamsSchema,
  response: {
    204: {},
  },
});
