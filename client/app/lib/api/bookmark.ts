import { client } from '../client';
import type { Bookmark, GetBookmarksResult } from './types';

export async function createBookmark(
  itemId: number,
  controller?: AbortController,
) {
  const response = await client.post<Bookmark>(
    '/api/bookmarks',
    { itemId },
    { signal: controller?.signal },
  );
  return response.data;
}

export async function deleteBookmark(
  itemId: number,
  controller?: AbortController,
) {
  const response = await client.delete('/api/bookmarks', {
    params: { itemId },
    signal: controller?.signal,
  });
  return response.data;
}

export async function getBookmarks(cursor?: number) {
  const response = await client.get<GetBookmarksResult>('/api/bookmarks', {
    params: { cursor },
  });
  return response.data;
}
