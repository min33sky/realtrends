import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import LinkCardList from '~/components/home/LinkCardList';
import TabLayout from '~/components/layout/TabLayout';
import { useInfinityScroll } from '~/hooks/useInfinityScroll';
import { getItems } from '~/lib/api/items';
import type { GetItemsResult } from '~/lib/api/types';
import { parseUrlParams } from '~/lib/parseUrlParams';

export const loader: LoaderFunction = async ({ request }) => {
  const { cursor } = parseUrlParams<{ cursor?: string }>(request.url);
  const parsedCursor = cursor ? parseInt(cursor, 10) : undefined;
  const list = await getItems(parsedCursor);
  return json(list);
};

/**
 * 메인 페이지
 */
export default function Index() {
  const data = useLoaderData<GetItemsResult>();
  const [pages, setPages] = useState([data]);
  const fetcher = useFetcher();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchNext = useCallback(() => {
    const { endCursor, hasNextPage } = pages.at(-1)?.pageInfo ?? {
      endCursor: null,
      hasNextPage: false,
    };

    console.log('hasNextPage', hasNextPage);
    if (fetcher.state === 'loading') return;
    if (!hasNextPage) return;
    console.log('load more');

    //? Remix에서 '?index&'를 붙여줘야 현재 페이지의 Loader함수를 불러오는 것 같다....
    fetcher.load(`/?index&cursor=${endCursor}`);
  }, [fetcher, pages]);

  useEffect(() => {
    if (!fetcher.data) return;
    if (pages.includes(fetcher.data)) return;
    setPages(pages.concat(fetcher.data));
  }, [fetcher.data, pages]);

  useInfinityScroll(loadMoreRef, fetchNext);

  const items = pages.flatMap((page) => page.list);

  console.log('pages: ', pages);

  return (
    <TabLayout>
      <LinkCardList items={items} />
      <div
        ref={loadMoreRef}
        className="bg-violet-600 p-2 text-lg font-semibold text-white"
      >
        More Load
      </div>
    </TabLayout>
  );
}
