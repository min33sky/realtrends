import React from 'react';
import type { Comment } from '~/lib/api/types';
import CommentItem from './CommentItem';

interface Props {
  comments: Comment[];
}

export default function CommentList({ comments }: Props) {
  return (
    <article className="p-4">
      <h3 aria-label="댓글 개수">댓글 0개</h3>
      <input
        type="text"
        className="flex h-12 w-full items-center rounded border border-gray-400 px-4 text-base outline-none"
        placeholder="댓글을 입력하세요"
      />
      <ul className="mt-2 flex flex-col gap-4">
        {comments.map((comment) => (
          <li key={comment.id}>
            <CommentItem comment={comment} />
          </li>
        ))}
      </ul>
    </article>
  );
}
