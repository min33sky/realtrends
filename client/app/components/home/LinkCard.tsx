import { HeartIcon } from '@heroicons/react/outline';
import React from 'react';
import { useItemOverrideById } from '~/contexts/ItemStatsContext';
import { useDateDistance } from '~/hooks/useDateDistance';
import { useLikeManager } from '~/hooks/useLikeManager';
import { likeItem } from '~/lib/api/items';
import type { Item } from '~/lib/api/types';
import LikeButton from '../system/LikeButton';
import { Globe } from '../vectors';

interface Props {
  item: Item;
}

export default function LinkCard({ item }: Props) {
  const {
    thumbnail,
    publisher,
    title,
    body,
    author,
    user,
    createdAt,
    id,
    ItemStats,
  } = item;
  const dataDistance = useDateDistance(createdAt);
  const { like, unlike } = useLikeManager();
  const itemOverride = useItemOverrideById(id);

  // ? Context에 있는 값을 우선으로 사용한다.
  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  console.log('id, ItemStats', id, ItemStats);
  console.log('id, ItemOverlideItemStats', id, itemOverride);
  const likes = itemOverride?.ItemStats.likes ?? ItemStats.likes;

  const toggleLike = () => {
    if (isLiked) {
      unlike(id, ItemStats);
    } else {
      like(id, ItemStats);
    }
  };

  // console.log('id, override: ', id, itemOverride);
  // console.log('Id, 좋아요 갯수: ', id, likes);

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

      {likes === 0 ? null : <div>좋아요 {likes.toLocaleString()}개</div>}

      <footer className="flex items-center justify-between">
        <LikeButton isLiked={isLiked} onClick={toggleLike} />
        <p>
          by <span>{user.username}</span> · {dataDistance}
        </p>
      </footer>
    </div>
  );
}
