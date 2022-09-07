import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import ItemViewer from '~/components/items/ItemViewer';
import BasicLayout from '~/components/layout/BasicLayout';
import { getItem } from '~/lib/api/items';
import type { Item } from '~/lib/api/types';

export const loader: LoaderFunction = async ({ params }) => {
  /** @todo: validate itemId */
  const itemId = parseInt(params.itemId!, 10);
  const item = await getItem(itemId);
  return json({
    item,
  });
};

interface ItemLoaderData {
  item: Item;
}

export default function ItemPage() {
  const { item } = useLoaderData<ItemLoaderData>();

  console.log('item', item);

  return (
    <BasicLayout hasBackButton title={null}>
      <ItemViewer item={item} />
    </BasicLayout>
  );
}
