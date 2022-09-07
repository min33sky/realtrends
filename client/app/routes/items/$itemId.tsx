import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import CommentList from '~/components/items/CommentList';
import ItemViewer from '~/components/items/ItemViewer';
import BasicLayout from '~/components/layout/BasicLayout';
import { getComments, getItem } from '~/lib/api/items';
import type { Comment, Item } from '~/lib/api/types';

export const loader: LoaderFunction = async ({ params }) => {
  /** @todo: validate itemId */
  const itemId = parseInt(params.itemId!, 10);

  const [item, comments] = await Promise.all([
    getItem(itemId),
    getComments(itemId),
  ]);

  return json({
    item,
    comments,
  });
};

interface ItemLoaderData {
  item: Item;
  comments: Comment[];
}

export default function ItemPage() {
  const { item, comments } = useLoaderData<ItemLoaderData>();

  console.log('item', item);
  console.log('comments', comments);

  return (
    <BasicLayout hasBackButton title={null}>
      <ItemViewer item={item} />
      <CommentList comments={comments} />
    </BasicLayout>
  );
}
