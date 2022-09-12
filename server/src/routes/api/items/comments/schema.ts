import { Type } from '@sinclair/typebox';
import { createRouteSchema, RoutesType } from '../../../../lib/routeSchema';
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

export const CommentsRouteSchema = createRouteSchema({
  GetComments: {
    params: ItemParamsSchema,
    response: {
      200: Type.Array(CommentSchema),
    },
  },
  GetComment: {
    params: CommentParamsSchema,
    response: {
      200: CommentSchema,
    },
  },
  GetSubComments: {
    params: CommentParamsSchema,
    response: {
      200: Type.Array(CommentSchema),
    },
  },
  CreateComment: {
    params: ItemParamsSchema,
    body: CreateCommentBodySchema,
    response: {
      200: CommentSchema,
    },
  },
  LikeComment: {
    params: CommentParamsSchema,
    response: {
      200: CommentLikeSchema,
    },
  },
  UnlikeComment: {
    params: CommentParamsSchema,
    response: {
      200: CommentLikeSchema,
    },
  },
  DeleteComment: {
    params: CommentParamsSchema,
    response: {
      204: {},
    },
  },
  UpdateComment: {
    params: CommentParamsSchema,
    body: UpdateCommentBodySchema,
  },
});

export type CommentsRoute = RoutesType<typeof CommentsRouteSchema>;
