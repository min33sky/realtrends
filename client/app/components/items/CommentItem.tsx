import {
  ChatBubbleLeftRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { useUser } from '~/contexts/UserContext';
import { useCommentLike } from '~/hooks/useCommentLike';
import { useDateDistance } from '~/hooks/useDateDistance';
import { useDeleteComment } from '~/hooks/useDeleteComment';
import useItemId from '~/hooks/useItemId';
import useOpenLoginDialog from '~/hooks/useOpenLoginDialog';
import type { Comment } from '~/lib/api/types';
import { useBottomSheetModalStore } from '~/stores/useBottomSheetModalStore';
import { useCommentInputStore } from '~/stores/useCommentInputStore';
import { useCommentLikeById } from '~/stores/useCommentLikesStore';
import LikeButton from '../system/LikeButton';
import SubcommentList from './SubcommentList';

interface Props {
  comment: Comment;
  isSubcomment?: boolean;
}

export default function CommentItem({ comment, isSubcomment }: Props) {
  const { user, createdAt, text, subcomments, mentionUser, isDeleted } =
    comment;

  const itemId = useItemId();
  const { open } = useCommentInputStore();
  const commentLike = useCommentLikeById(comment.id);
  const { like, unlike } = useCommentLike();
  const openLoginDialog = useOpenLoginDialog();
  const currentUser = useUser();
  const isMyComment = currentUser?.id === user.id;
  const openBottomSheetModal = useBottomSheetModalStore((store) => store.open);
  const deleteComment = useDeleteComment();

  const onClickMore = () => {
    openBottomSheetModal([
      {
        name: '수정',
        onClick: () => {},
      },
      {
        name: '삭제',
        onClick: () => deleteComment(comment.id),
      },
    ]);
  };

  //? Client Cache값을 우선적으로 사용
  const likes = commentLike?.likes ?? comment.likes;
  const isLiked = commentLike?.isLiked ?? comment.isLiked;

  const dateDistance = useDateDistance(createdAt);

  const toggleLike = () => {
    if (!itemId) return;

    if (!currentUser) {
      openLoginDialog('commentLike');
      return;
    }

    if (isLiked) {
      unlike({ commentId: comment.id, itemId, prevLikes: likes });
    } else {
      like({ commentId: comment.id, itemId, prevLikes: likes });
    }
  };

  const onReply = () => {
    open(comment.id);
  };

  if (isDeleted) {
    return (
      <div>
        <p>삭제된 댓글입니다.</p>
        {!isSubcomment && subcomments && (
          <SubcommentList comments={subcomments} />
        )}
      </div>
    );
  }

  return (
    <article
      aria-label="댓글"
      data-comment-id={comment.id}
      className="flex flex-col"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <div className="text-base font-semibold text-gray-800">
            {user.username}
          </div>
          <div className="text-xs leading-normal text-gray-400">
            {dateDistance}
          </div>
        </div>
        {isMyComment && (
          <EllipsisVerticalIcon
            className="h-6 w-6 cursor-pointer"
            onClick={onClickMore}
          />
        )}
      </header>

      <p className="mt-1 mb-3 whitespace-pre-wrap text-sm leading-normal text-gray-800">
        {mentionUser ? (
          <span className="mr-1 text-violet-500">@{mentionUser.username}</span>
        ) : null}
        {text}
      </p>

      <footer className="flex gap-2 text-xs leading-normal text-gray-400">
        <div className="flex items-center gap-x-2">
          <LikeButton size="small" onClick={toggleLike} isLiked={isLiked} />
          <span className="min-w-[24px]">{likes.toLocaleString()}</span>
        </div>
        <button onClick={onReply} className="flex items-center gap-x-1">
          <ChatBubbleLeftRightIcon className="h-4 w-4" /> 댓글 달기
        </button>
      </footer>
      {!isSubcomment && subcomments && (
        <SubcommentList comments={subcomments} />
      )}
    </article>
  );
}
