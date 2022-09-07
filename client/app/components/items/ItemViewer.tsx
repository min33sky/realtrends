import React from 'react';
import type { Item } from '~/lib/api/types';

interface Props {
  item: Item;
}

export default function ItemViewer({ item }: Props) {
  const { thumbnail } = item;

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
    </article>
  );
}
