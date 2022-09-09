import { useParams } from '@remix-run/react';

/**
 * Return itemId URL Parameter in items page
 */
export default function useItemId() {
  const { itemId } = useParams<{ itemId: string }>();
  const parsed = itemId ? parseInt(itemId, 10) : null;
  if (parsed && isNaN(parsed)) return null;
  return parsed;
}
