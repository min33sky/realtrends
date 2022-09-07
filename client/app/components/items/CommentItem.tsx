import React from 'react';
import { useDateDistance } from '~/hooks/useDateDistance';
import type { Comment } from '~/lib/api/types';
import SubcommentList from './SubcommentList';

interface Props {
  comment: Comment;
  isSubcomment?: boolean;
}

export default function CommentItem({ comment, isSubcomment }: Props) {
  const { user, createdAt, text, subcomments } = comment;
  const dateDistance = useDateDistance(createdAt);

  return (
    <li className="flex flex-col">
      <header className="flex items-center justify-end gap-1">
        <div className="text-base font-semibold text-gray-800">
          {user.username}
        </div>
        <div className="text-xs leading-normal text-gray-400">
          {dateDistance}
        </div>
      </header>
      <p className="mt-1 mb-2 whitespace-pre-wrap leading-normal text-gray-800">
        {text}
      </p>
      {!isSubcomment && subcomments && (
        <SubcommentList comments={subcomments} />
      )}
    </li>
  );
}
