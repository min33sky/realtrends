import { client } from '../client';
import type { Comment, GetItemsResult, Item, LikeItemResult } from './types';
import qs from 'qs';

export async function createItem(params: CreateItemParams) {
  const response = await client.post<Item>('/api/items', params);
  return response.data;
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

export async function getItem(itemId: number) {
  const response = await client.get<Item>(`/api/items/${itemId}`);
  return response.data;
}

//? controller? : Axios에서 요청 취소할 때 사용하는 컨트롤러
export async function likeItem(itemId: number, controller?: AbortController) {
  const response = await client.post<LikeItemResult>(
    `/api/items/${itemId}/likes`,
    {},
    {
      signal: controller?.signal,
    },
  );

  return response.data;
}

export async function unlikeItem(itemId: number, contoller?: AbortController) {
  const response = await client.delete<LikeItemResult>(
    `/api/items/${itemId}/likes`,
    {
      signal: contoller?.signal,
    },
  );

  return response.data;
}

export async function getComments(itemId: number) {
  const response = await client.get<Comment[]>(`/api/items/${itemId}/comments`);
  return response.data;
}

interface CreateItemParams {
  title: string;
  body: string;
  link: string;
  tags?: string[];
}
