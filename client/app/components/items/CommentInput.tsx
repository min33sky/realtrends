import React from 'react';
import { useCommentInputStore } from '~/lib/stores/useCommentInputStore';

export default function CommentInput() {
  const open = useCommentInputStore((store) => store.open);

  return (
    <input
      type="text"
      className="flex h-12 w-full items-center rounded border border-gray-400 px-4 text-base outline-none"
      placeholder="댓글을 입력하세요"
      onClick={open}
    />
  );
}
