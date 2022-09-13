import produce from 'immer';
import create from 'zustand';

//? 댓굴 좋아요 갯수, 좋아요 여부를 관리하는 스토어
//? 인터넷 속도가 느릴 경우, 좋아요 관련 정보의 반영이 제대로 안 될 수있다.
//? reactQuery의 queryClient의 cache를 수정하는 방법도 있지만
//? Array보다 Map으로 관리하는 것이 속도에 더 유리하다.

interface CommentLike {
  likes: number;
  isLiked: boolean;
}

interface CommentLikesStore {
  commentLikesById: Record<number, CommentLike | undefined>;
  set: (commentId: number, commentLike: CommentLike) => void;
}

export const useCommentLikesStore = create<CommentLikesStore>((set) => ({
  commentLikesById: {},
  set(commentId, commentLike) {
    set((store) =>
      produce(store, (draft) => {
        draft.commentLikesById[commentId] = commentLike;
      }),
    );
  },
}));

export function useCommentLikeById(commentId: number) {
  const commentLikesById = useCommentLikesStore(
    (store) => store.commentLikesById,
  );
  return commentLikesById[commentId];
}

export function useCommentLikeSetter() {
  return useCommentLikesStore((store) => store.set);
}
