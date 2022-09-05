import { useNavigate } from '@remix-run/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDialog } from '~/contexts/DialogContext';
import { useItemOverrideById } from '~/contexts/ItemStatsContext';
import { useUser } from '~/contexts/UserContext';
import { useDateDistance } from '~/hooks/useDateDistance';
import { useLikeManager } from '~/hooks/useLikeManager';
import type { Item } from '~/lib/api/types';
import LikeButton from '../system/LikeButton';
import { Globe } from '../vectors';

interface Props {
  item: Item;
}

export default function LinkCard({ item }: Props) {
  const { thumbnail, publisher, title, body, author, user, createdAt, id } =
    item;

  const dataDistance = useDateDistance(createdAt);
  const { like, unlike } = useLikeManager();
  const itemOverride = useItemOverrideById(id);
  const ItemStats = itemOverride?.ItemStats ?? item.ItemStats;

  // ? Context에 있는 값을 우선으로 사용한다.
  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  const likes = itemOverride?.ItemStats.likes ?? ItemStats.likes;

  const navigate = useNavigate();
  const currentUser = useUser();
  const { open } = useDialog();

  const toggleLike = () => {
    if (!currentUser) {
      open({
        title: '로그인이 필요합니다.',
        description: '로그인이 필요한 기능입니다.',
        onConfirm: () => navigate('/auth/login'),
      });
      return;
    }

    if (isLiked) {
      unlike(id, ItemStats);
    } else {
      like(id, ItemStats);
    }
  };

  return (
    <div className="flex flex-col">
      <figure>
        <img
          src={thumbnail}
          className="mb-2 block aspect-[288/192] w-full rounded-xl object-cover shadow"
          alt="thumbnail"
        />
      </figure>

      <div aria-label="publisher" className="mb-2 flex items-center">
        {publisher.favicon ? (
          <img src={publisher.favicon} className="mr-2 h-4 w-4" alt="favicon" />
        ) : (
          <Globe className="mr-2" />
        )}
        <p>{author ? `${author} · ` : ''}</p>
        <p className="ml-1 text-sm text-gray-600">{publisher.name}</p>
      </div>

      <h3 className="mb-2 font-semibold text-gray-800">{title}</h3>

      <p className="mb-2 text-sm text-gray-500 line-clamp-5">{body}</p>

      <AnimatePresence initial={false}>
        {likes === 0 ? null : (
          <motion.div
            key="like"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 24, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            좋아요 {likes.toLocaleString()}개
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative flex items-center justify-between ">
        <LikeButton isLiked={isLiked} onClick={toggleLike} />
        <p>
          by <span>{user.username}</span> · {dataDistance}
        </p>
      </footer>
    </div>
  );
}
