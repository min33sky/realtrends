import React from 'react';
import type { Item } from '~/lib/api/types';
import LinkCard from './LinkCard';

interface Props {
  items: Item[];
}

export default function LinkCardList({ items }: Props) {
  return (
    <ul className="mx-auto grid gap-12 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <LinkCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
