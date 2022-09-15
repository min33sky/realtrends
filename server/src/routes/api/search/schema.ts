import { Type } from '@sinclair/typebox';
import { PaginationSchema } from '../../../lib/pagination';
import { createRouteSchema, RoutesType } from '../../../lib/routeSchema';
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
    favicon: Type.String(),
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

export const SearchRoutesSchema = createRouteSchema({
  Search: {
    querystring: SearchQuerySchema,
    response: {
      200: PaginationSchema(SearchResultItemSchema),
    },
  },
});

export type SearchRoute = RoutesType<typeof SearchRoutesSchema>;
