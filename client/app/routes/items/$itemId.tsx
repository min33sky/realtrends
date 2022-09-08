import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import CommentInputOverlay from '~/components/items/CommentInputOverlay';
import CommentList from '~/components/items/CommentList';
import ItemViewer from '~/components/items/ItemViewer';
import BasicLayout from '~/components/layout/BasicLayout';
import { useCommentsQuery } from '~/hooks/query/useCommentsQuery';
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
  const loaderData = useLoaderData<ItemLoaderData>();

  const { data: comments } = useCommentsQuery(loaderData.item.id, {
    initialData: loaderData.comments,
  });

  return (
    <BasicLayout hasBackButton title={null}>
      <ItemViewer item={loaderData.item} />
      {/* 'comments' is always valid due to SSR */}
      <CommentList comments={comments!} />
      <CommentInputOverlay />
    </BasicLayout>
  );
}
