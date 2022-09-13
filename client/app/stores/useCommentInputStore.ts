import create from 'zustand';

interface CommentInputStore {
  visible: boolean;
  parentCommentId: number | null; //? 대댓글의 경우에 부보 댓글의 ID가 필요하다.
  open: (parentCommentId?: number | null) => void;
  close: () => void;
}

/**
 * 댓글 입력창을 관리하는 스토어
 */
export const useCommentInputStore = create<CommentInputStore>((set) => ({
  visible: false,
  parentCommentId: null,
  open: (parentCommentId = null) =>
    set((store) => ({ ...store, parentCommentId, visible: true })),
  close: () => set((store) => ({ ...store, visible: false })),
}));
