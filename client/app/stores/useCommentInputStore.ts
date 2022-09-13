import create from 'zustand';

interface CommentInputStore {
  visible: boolean;
  parentCommentId: number | null; //? 대댓글의 경우에 부보 댓글의 ID가 필요하다.
  commentId: number | null; //? 댓글을 수정할 때 필요하다.
  defaultText: string; //? 댓글을 수정할 때 원본 댓글 텍스트를 불러온다.
  write: (parentCommentId?: number | null) => void; //? 댓글 등록 모드 (parentCommentId가 있으면 대댓글 모드)
  edit: (commentId: number, defaultText: string) => void; //? 댓글 수정 모드
  close: () => void;
}

/**
 * 댓글 입력창에 대한 정보를 관리하는 스토어
 */
export const useCommentInputStore = create<CommentInputStore>((set) => ({
  visible: false,
  parentCommentId: null,
  commentId: null,
  defaultText: '',
  write: (parentCommentId = null) =>
    set((store) => ({ ...store, parentCommentId, visible: true })),
  edit: (commentId, defaultText) =>
    set((store) => ({ ...store, commentId, defaultText, visible: true })),
  close: () =>
    set((store) => ({
      ...store,
      commentId: null,
      defaultText: '',
      visible: false,
    })),
}));
