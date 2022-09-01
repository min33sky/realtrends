import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import LinkCardList from '~/components/home/LinkCardList';
import TabLayout from '~/components/layout/TabLayout';
import { getItems } from '~/lib/api/items';
import type { GetItemsResult } from '~/lib/api/types';

export const loader: LoaderFunction = async ({ request }) => {
  const list = await getItems();
  return json(list);
};

export default function Index() {
  const data = useLoaderData<GetItemsResult>();
  console.log('data::::: ', data);

  return (
    <TabLayout>
      <LinkCardList items={data.list} />
    </TabLayout>
  );
}
