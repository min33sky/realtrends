import { FastifyPluginAsync } from 'fastify';
import algolia from '../../../lib/algolia';
import ItemService from '../../../services/ItemService';
import { SearchRoute, SearchRoutesSchema } from './schema';

export const searchRoute: FastifyPluginAsync = async (fastify) => {
  const itemService = ItemService.getInstance();

  fastify.get<SearchRoute['Search']>(
    '/',
    {
      schema: SearchRoutesSchema.Search,
    },
    async (request) => {
      const { q, offset, limit } = request.query;
      const hits = await algolia.search(q, { offset, length: limit });
      const items = await itemService.getItemsByIds(
        hits.list.map((item) => item.id),
      );

      const sealizedList = hits.list
        .map((hit) => {
          const item = items[hit.id];
          if (!item) return null;
          return {
            id: item.id,
            link: item.link,
            publisher: item.publisher,
            likes: item.ItemStats?.likes,
            title: item.title,
            body: item.body,
            highlight: {
              title: hit._highlightResult?.title?.value ?? null,
              body: hit._highlightResult?.body?.value ?? null,
            },
          };
        })
        .filter((item) => item !== null);

      return { ...hits, list: sealizedList };
    },
  );
};