import React from 'react';
import type { Item } from '~/lib/api/types';
import LinkCard from './LinkCard';

interface Props {
  items: Item[];
}

export default function LinkCardList({ items }: Props) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <LinkCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
