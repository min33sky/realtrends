import React from 'react';
import type { Item } from '~/lib/api/types';

interface Props {
  item: Item;
}

export default function LinkCard({ item }: Props) {
  return <div className="flex flex-col">LinkCard</div>;
}
