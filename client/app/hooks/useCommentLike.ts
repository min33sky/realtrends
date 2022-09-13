import { useCallback } from 'react';
import { likeComment, unlikeComment } from '~/lib/api/items';
import { useCommentLikeSetter } from '~/stores/useCommentLikesStore';

/**
 * 댓글 좋아요 정보를 관리하는 훅
 */
export function useCommentLike() {
  const set = useCommentLikeSetter();

  const like = useCallback(
    ({ commentId, itemId, prevLikes }: LikeParams) => {
      //? 좋아요 요청 API 호출 (클라이언트 값을 우선 사용할 것이므로 await 사용하지 않음(써도 상관없음))
      likeComment({ itemId, commentId });
      //? 클라이언트의 좋아요 상태값을 변경
      set(commentId, { likes: prevLikes + 1, isLiked: true });
    },
    [set],
  );

  const unlike = useCallback(
    ({ commentId, itemId, prevLikes }: UnlikeParmas) => {
      unlikeComment({ itemId, commentId });
      set(commentId, { likes: prevLikes - 1, isLiked: false });
    },
    [set],
  );

  return { like, unlike };
}

interface LikeParams {
  commentId: number;
  itemId: number;
  prevLikes: number; // 이전 좋아요 갯수
}

type UnlikeParmas = LikeParams;
