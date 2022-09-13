import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { deleteComment } from '~/lib/api/items';
import { useCommentsQuery } from './query/useCommentsQuery';
import useItemId from './useItemId';

export function useDeleteComment() {
  const itemId = useItemId();
  const queryClient = useQueryClient();

  return useCallback(
    async (commentId: number) => {
      if (!itemId) return;
      await deleteComment({
        itemId,
        commentId,
      });

      //? cache를 수정하는게 더 좋지만 귀찮아서 쿼리 무효화로 처리
      queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId));
    },
    [itemId, queryClient],
  );
}
