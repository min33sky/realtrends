import React, { useCallback, useRef } from 'react';
import { createBookmark, deleteBookmark } from '~/lib/api/bookmark';
import { useItemOverrideSetter } from '~/stores/useItemOverrideStore';

export default function useBookmarkManager() {
  const set = useItemOverrideSetter();
  const abortControllers = useRef(new Map<number, AbortController>()).current;

  const create = useCallback(
    async (itemId: number) => {
      const prevController = abortControllers.get(itemId);

      try {
        prevController?.abort(); //? 이전 요청이 있으면 취소
        set(itemId, { isBookmarked: true }); //? 좋아요 상태로 변경
        const controller = new AbortController();
        await createBookmark(itemId, controller); //? 서버에 요청
        abortControllers.delete(itemId); //? 요청이 끝나면 abortControllers에서 삭제
      } catch (error: any) {
        // if (error.name !== 'AbortError') {
        //   set(itemId, { isBookmarked: false }); //? 요청이 실패하면 좋아요 상태를 false로 변경
        // }
      }
    },
    [abortControllers, set],
  );

  const remove = useCallback(
    async (itemId: number) => {
      const prevController = abortControllers.get(itemId);

      try {
        prevController?.abort(); //? 이전 요청이 있으면 취소
        set(itemId, { isBookmarked: false }); //? 좋아요 상태로 변경
        const controller = new AbortController();
        await deleteBookmark(itemId, controller); //? 서버에 요청
        abortControllers.delete(itemId); //? 요청이 끝나면 abortControllers에서 삭제
      } catch (error: any) {
        // if (error.name !== 'AbortError') {
        //   set(itemId, { isBookmarked: true }); //? 요청이 실패하면 좋아요 상태를 true로 변경
        // }
      }
    },
    [abortControllers, set],
  );

  return { create, remove };
}
