import { Publisher } from '@prisma/client';
import algoliasearch from 'algoliasearch';
import { ItemType } from '../routes/api/items/schema';
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
  // algolia에서 검색하기
  async search(query: string, { offset = 0, length = 20 }: SearchOption = {}) {
    const result = await index.search<ItemType>(query, { offset, length });

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

  //? algolia와 db를 동기화하는 함수
  sync(item: ItemSchemaForAlgolia) {
    return index.saveObject({ ...item, objectID: item.id });
  },

  //? algolia에서 해당 값을 제거
  delete(objectID: number) {
    return index.deleteObject(objectID.toString());
  },
};

interface SearchOption {
  offset?: number;
  length?: number;
}

interface ItemSchemaForAlgolia {
  id: number;
  title: string;
  body: string;
  author: string | null;
  link: string | null;
  thumbnail: string | null;
  username: string;
  publisher: Publisher;
}

export default algolia;
