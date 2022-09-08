import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { useDateDistance } from '~/hooks/useDateDistance';
import type { Comment } from '~/lib/api/types';
import LikeButton from '../system/LikeButton';
import SubcommentList from './SubcommentList';

interface Props {
  comment: Comment;
  isSubcomment?: boolean;
}

export default function CommentItem({ comment, isSubcomment }: Props) {
  const { user, createdAt, text, subcomments, likesCount, mentionUser } =
    comment;
  const dateDistance = useDateDistance(createdAt);

  return (
    <li className="flex flex-col">
      <header className="flex items-center justify-start gap-x-1">
        <div className="text-base font-semibold text-gray-800">
          {user.username}
        </div>
        <div className="text-xs leading-normal text-gray-400">
          {dateDistance}
        </div>
      </header>
      <p className="mt-1 mb-3 whitespace-pre-wrap text-sm leading-normal text-gray-800">
        {mentionUser ? (
          <span className="mr-1 text-violet-500">@{mentionUser.username}</span>
        ) : null}
        {text}
      </p>
      <footer className="flex gap-2 text-xs leading-normal text-gray-400">
        <div className="flex items-center gap-x-2">
          <LikeButton size="small" />
          <span className="min-w-[24px]">{likesCount.toLocaleString()}</span>
        </div>
        <button className="flex items-center gap-x-1">
          <ChatBubbleLeftRightIcon className="h-4 w-4" /> 댓글 달기
        </button>
      </footer>
      {!isSubcomment && subcomments && (
        <SubcommentList comments={subcomments} />
      )}
    </li>
  );
}
