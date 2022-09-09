import React from 'react';
import { useUser } from '~/contexts/UserContext';
import useOpenLoginDialog from '~/hooks/useOpenLoginDialog';
import { useCommentInputStore } from '~/lib/stores/useCommentInputStore';

export default function CommentInput() {
  const open = useCommentInputStore((store) => store.open);
  const user = useUser();
  const openLoginDialog = useOpenLoginDialog();

  const onClick = () => {
    if (!user) {
      openLoginDialog('comment');
      return;
    }
    open();
  };

  return (
    <input
      type="text"
      className="flex h-12 w-full items-center rounded border border-gray-400 px-4 text-base outline-none"
      placeholder="댓글을 입력하세요"
      onClick={onClick}
    />
  );
}
