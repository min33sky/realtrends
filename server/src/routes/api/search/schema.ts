import { Type } from '@sinclair/typebox';
import { PaginationSchema } from '../../../lib/pagination';
import {
  createRouteSchema,
  routesSchema,
  RoutesType,
} from '../../../lib/routeSchema';
import { Nullable } from '../../../lib/typebox';

const SearchQuerySchema = Type.Object({
  q: Type.String(),
  offset: Type.Optional(Type.Integer()),
  limit: Type.Optional(Type.Integer()),
});

const SearchResultItemSchema = Type.Object({
  id: Type.Integer(),
  link: Type.String(),
  publisher: Type.Object({
    name: Type.String(),
    favicon: Nullable(Type.String()),
    domain: Type.String(),
  }),
  author: Nullable(Type.String()),
  likes: Type.Number(),
  title: Type.String(),
  body: Type.String(),
  highlight: Type.Object({
    title: Type.String(),
    body: Type.String(),
  }),
});

export const searchSchema = routesSchema({
  tags: ['search'],
  querystring: SearchQuerySchema,
  response: {
    200: PaginationSchema(SearchResultItemSchema),
  },
});
