import React from 'react';
import type { SearchResultItem } from '~/lib/api/types';
import { Globe } from '../vectors';

interface Props {
  item: SearchResultItem;
}

export default function SearchResultCard({ item }: Props) {
  const { publisher, author, highlight } = item;

  return (
    <div>
      <div aria-label="publisher" className="mb-2 flex items-center">
        {publisher.favicon ? (
          <img src={publisher.favicon} className="mr-2 h-4 w-4" alt="favicon" />
        ) : (
          <Globe className="mr-2" />
        )}
        <p>{author ? `${author} · ` : ''}</p>
        <p className="ml-1 text-sm text-gray-600">{publisher.name}</p>
      </div>

      <h3 dangerouslySetInnerHTML={{ __html: highlight.title }}></h3>
      <p dangerouslySetInnerHTML={{ __html: highlight.body }}></p>
    </div>
  );
}
