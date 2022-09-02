import { client } from '../client';
import type { GetItemsResult, Item } from './types';
import qs from 'qs';

export async function createItem(params: CreateItemParams) {
  const response = await client.post<Item>('/api/items', params);
  const result = response.data;
  return result;
}

export async function getItems(cursor?: number) {
  const response = await client.get<GetItemsResult>(
    '/api/items'.concat(
      qs.stringify(
        { cursor },
        {
          addQueryPrefix: true, //? 앞에 ?를 붙여줌
        },
      ),
    ),
  );
  return response.data;
}

interface CreateItemParams {
  title: string;
  body: string;
  link: string;
  tags?: string[];
}
