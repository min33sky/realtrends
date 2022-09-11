import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '~/contexts/UserContext';
import { useDateDistance } from '~/hooks/useDateDistance';
import { useLikeManager } from '~/hooks/useLikeManager';
import useOpenLoginDialog from '~/hooks/useOpenLoginDialog';
import type { Item } from '~/lib/api/types';
import { useItemOverrideById } from '~/stores/useItemOverrideStore';
import LikeButton from '../system/LikeButton';
import { Globe } from '../vectors';

interface Props {
  item: Item;
}

export default function ItemViewer({ item }: Props) {
  const { thumbnail, id, publisher, author, title, body, user, createdAt } =
    item;

  const itemOverride = useItemOverrideById(id); //? Context에 있는 값을 우선으로 사용한다.
  const dateDistance = useDateDistance(createdAt);

  const itemStats = itemOverride?.ItemStats ?? item.ItemStats;
  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  const likes = itemOverride?.ItemStats.likes ?? item.ItemStats.likes;

  const { like, unlike } = useLikeManager();
  const openLoginDialog = useOpenLoginDialog();
  const currentUser = useUser();

  const toggleLike = () => {
    if (!currentUser) {
      openLoginDialog('like');
      return;
    }

    if (isLiked) {
      unlike(id, itemStats);
    } else {
      like(id, itemStats);
    }
  };

  return (
    <article className="flex flex-col">
      <figure>
        {thumbnail ? (
          <img
            className="h-auto max-h-[80vh] w-full object-contain"
            src={thumbnail}
            alt="thumbnail"
          />
        ) : null}
      </figure>
      <div aria-label="content" className="border-b border-gray-100 p-4">
        <div aria-label="publisher" className="mb-2 flex items-center">
          {publisher.favicon ? (
            <img
              src={publisher.favicon}
              className="mr-2 h-4 w-4"
              alt="favicon"
            />
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

        <footer className="relative flex h-9 items-center justify-between">
          <LikeButton isLiked={isLiked} onClick={toggleLike} />
          <p>
            by <span>{user.username}</span> · {dateDistance}
          </p>
        </footer>
      </div>
    </article>
  );
}
