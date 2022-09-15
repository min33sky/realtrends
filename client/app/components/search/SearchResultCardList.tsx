import type { SearchResultItem } from '~/lib/api/types';
import SearchResultCard from './SearchResultCard';

interface Props {
  items: SearchResultItem[];
}

export default function SearchResultCardList({ items }: Props) {
  return (
    <div className="flex flex-col gap-y-6 py-6 px-4">
      {items.map((item) => (
        <SearchResultCard key={item.id} item={item} />
      ))}
    </div>
  );
}
