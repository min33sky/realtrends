import algoliasearch from 'algoliasearch';
import { PaginationType } from './pagination';

if (!process.env.ALGOLIA_APP_ID) {
  throw new Error('ALGOLIA_APP_ID is not defined');
}

if (!process.env.ALGOLIA_ADMIN_KEY) {
  throw new Error('ALGOLIA_ADMIN_KEY is not defined');
}

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY,
);

const index = client.initIndex('realtrends_items');

const algolia = {
  async search(query: string, { offset = 0, length = 20 }: SearchOption = {}) {
    const result = await index.search(query, { offset, length });

    const hasNextPage = offset + length < result.nbHits;

    const pagination: PaginationType<typeof result.hits[0]> = {
      list: result.hits,
      totalCount: result.nbHits,
      pageInfo: {
        hasNextPage,
        nextOffset: hasNextPage ? offset + length : undefined,
      },
    };

    return pagination;
  },
};

interface SearchOption {
  offset?: number;
  length?: number;
}

export default algolia;
