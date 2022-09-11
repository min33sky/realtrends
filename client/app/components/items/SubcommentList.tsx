import React from 'react';
import type { Comment } from '~/lib/api/types';
import CommentItem from './CommentItem';

interface Props {
  comments: Comment[];
}

export default function SubcommentList({ comments }: Props) {
  if (comments.length === 0) return null;
  return (
    <ul className="flex flex-col gap-6 pl-6 pt-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </ul>
  );
}
