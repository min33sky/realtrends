import { client } from '../client';
import type {
  Comment,
  GetItemsResult,
  Item,
  LikeCommentResult,
  LikeItemResult,
  ListMode,
  UnlikeCommentResult,
} from './types';
import qs from 'qs';

export async function createItem(params: CreateItemParams) {
  const response = await client.post<Item>('/api/items', params);
  return response.data;
}

export async function getItems({
  mode,
  cursor,
  startDate,
  endDate,
}: {
  cursor?: number;
  mode: ListMode;
  startDate?: string;
  endDate?: string;
}) {
  const response = await client.get<GetItemsResult>(
    '/api/items'.concat(
      qs.stringify(
        { mode, cursor, startDate, endDate },
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

export async function updateItem({
  body,
  itemId,
  title,
}: {
  itemId: number;
  title: string;
  body: string;
}) {
  const response = await client.patch<Item>(`/api/items/${itemId}`, {
    title,
    body,
    tags: [], //! 아직 미구현. 에러 방지를 위해 빈배열을 보냄
  });
  return response.data;
}

export async function deleteItem(itemId: number) {
  return client.delete(`/api/items/${itemId}`);
}

export async function getComments(itemId: number) {
  const response = await client.get<Comment[]>(`/api/items/${itemId}/comments`);
  return response.data;
}

/**
 * 댓글 작성
 * @description 루트 댓글일 경우 parentCommentId는 undefined
 */
export async function createComment({
  itemId,
  parentCommentId,
  text,
}: {
  itemId: number;
  parentCommentId?: number;
  text: string;
}) {
  const response = await client.post<Comment>(`/api/items/${itemId}/comments`, {
    itemId,
    parentCommentId,
    text,
  });
  return response.data;
}

/**
 * 댓글 좋아요 API
 */
export async function likeComment({
  commentId,
  itemId,
}: {
  itemId: number;
  commentId: number;
}) {
  const response = await client.post<LikeCommentResult>(
    `/api/items/${itemId}/comments/${commentId}/likes`,
    {},
  );
  return response.data;
}

export async function unlikeComment({
  commentId,
  itemId,
}: {
  itemId: number;
  commentId: number;
}) {
  const respnose = await client.delete<UnlikeCommentResult>(
    `/api/items/${itemId}/comments/${commentId}/likes`,
  );
  return respnose.data;
}

export async function deleteComment({
  commentId,
  itemId,
}: {
  itemId: number;
  commentId: number;
}) {
  const response = await client.delete(
    `/api/items/${itemId}/comments/${commentId}`,
  );
  return response.data;
}

export async function editComment({
  commentId,
  itemId,
  text,
}: {
  itemId: number;
  commentId: number;
  text: string;
}) {
  const response = await client.patch<Comment>(
    `/api/items/${itemId}/comments/${commentId}`,
    {
      text,
    },
  );
  return response.data;
}

interface CreateItemParams {
  title: string;
  body: string;
  link: string;
  tags?: string[];
}
