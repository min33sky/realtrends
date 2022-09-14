import { Type } from '@sinclair/typebox';
import { createRouteSchema, RoutesType } from '../../../lib/routeSchema';

const SearchQuerySchema = Type.Object({
  q: Type.String(),
  offset: Type.Optional(Type.Integer()),
  limit: Type.Optional(Type.Integer()),
});

export const SearchRoutesSchema = createRouteSchema({
  Search: {
    querystring: SearchQuerySchema,
  },
});

export type SearchRoute = RoutesType<typeof SearchRoutesSchema>;
