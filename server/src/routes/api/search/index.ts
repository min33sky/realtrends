import { FastifyPluginAsync } from 'fastify';
import algolia from '../../../lib/algolia';
import { SearchRoute, SearchRoutesSchema } from './schema';

export const searchRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get<SearchRoute['Search']>(
    '/',
    {
      schema: SearchRoutesSchema.Search,
    },
    async (request) => {
      const { q, offset, limit } = request.query;
      const hits = await algolia.search(q);
      return hits;
    },
  );
};
