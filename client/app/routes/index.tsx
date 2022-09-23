import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useFetcher, useLoaderData, useNavigate } from '@remix-run/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import LinkCardList from '~/components/home/LinkCardList';
import ListModeSelector from '~/components/home/ListModeSelector';
import TabLayout from '~/components/layout/TabLayout';
import { useInfinityScroll } from '~/hooks/useInfinityScroll';
import { getItems } from '~/lib/api/items';
import type { GetItemsResult, ListMode } from '~/lib/api/types';
import { parseUrlParams } from '~/lib/parseUrlParams';

export const loader: LoaderFunction = async ({ request }) => {
  const { cursor, mode } = parseUrlParams<{ cursor?: string; mode?: string }>(
    request.url,
  );
  const parsedCursor = cursor ? parseInt(cursor, 10) : undefined;
  const fallbackedMode = mode ?? 'trending'; //TODO : trending으로 바꿔줘야함

  const list = await getItems({
    mode: fallbackedMode as any,
    cursor: parsedCursor,
  });
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
  const [mode, setMode] = useState<ListMode>('trending');
  const navigate = useNavigate();

  useEffect(() => {
    const nextUrl = mode === 'trending' ? '/' : `/?mode=${mode}`;
    navigate(nextUrl, { replace: true });
  }, [mode, navigate]);

  const fetchNext = useCallback(() => {
    const { endCursor, hasNextPage } = pages.at(-1)?.pageInfo ?? {
      endCursor: null,
      hasNextPage: false,
    };

    if (fetcher.state === 'loading') return;
    if (!hasNextPage) return;

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
      <ListModeSelector mode={mode} onSelectMode={setMode} />
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
