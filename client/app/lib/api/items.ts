import { client } from '../client';
import type { GetItemsResult, Item } from './types';

export async function createItem(params: CreateItemParams) {
  const response = await client.post<Item>('/api/items', params);
  const result = response.data;
  return result;
}

export async function getItems() {
  const response = await client.get<GetItemsResult>('/api/items');
  return response.data;
}

interface CreateItemParams {
  title: string;
  body: string;
  link: string;
  tags?: string[];
}
