import { HeartIcon, UserAddIcon } from '@heroicons/react/outline';
import React from 'react';
import { useDateDistance } from '~/hooks/useDateDistance';
import type { Item } from '~/lib/api/types';
import { Globe } from '../vectors';

interface Props {
  item: Item;
}

export default function LinkCard({ item }: Props) {
  const { thumbnail, publisher, body, author, user, createdAt } = item;
  const dataDistance = useDateDistance(createdAt);

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

      <h3 className="mb-2 font-semibold text-gray-800">{item.title}</h3>

      <p className="text-sm text-gray-500">{body}</p>
      <footer className="flex items-center justify-between">
        <HeartIcon className="h-5 w-5" />
        <p>
          by <span>{user.username}</span> · {dataDistance}
        </p>
      </footer>
    </div>
  );
}
