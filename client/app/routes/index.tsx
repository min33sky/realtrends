import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LinkCardList from '~/components/home/LinkCardList';
import ListModeSelector from '~/components/home/ListModeSelector';
import WeekSelector from '~/components/home/WeekSelector';
import TabLayout from '~/components/layout/TabLayout';
import { useInfinityScroll } from '~/hooks/useInfinityScroll';
import { getItems } from '~/lib/api/items';
import type { GetItemsResult, ListMode } from '~/lib/api/types';
import { parseUrlParams } from '~/lib/parseUrlParams';
import { getWeekRangeFromDate } from '~/lib/week';

export const loader: LoaderFunction = async ({ request }) => {
  const { mode } = parseUrlParams<{ mode?: string }>(request.url);
  const fallbackedMode = mode ?? 'trending';

  const range = mode === 'past' ? getWeekRangeFromDate(new Date()) : undefined;
  const startDate = range?.[0];
  const endDate = range?.[1];

  console.log('##### startDate: ', startDate);
  console.log('##### endDate: ', endDate);

  // TODO: throw error if invalid error
  const list = await getItems({
    mode: fallbackedMode as any,
    startDate,
    endDate,
  });

  return json(list);
};

/**
 * 메인 페이지
 */
export default function Index() {
  const initialData = useLoaderData<GetItemsResult>();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<ListMode>(
    (searchParams.get('mode') as any) ?? 'trending',
  );
  const navigate = useNavigate();
  const defaultDateRange = useMemo(() => getWeekRangeFromDate(new Date()), []);
  const startDate = searchParams.get('startDate');
  const endEate = searchParams.get('endDate');
  const [dateRange, setDateRange] = useState(
    startDate && endEate ? [startDate, endEate] : defaultDateRange,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  console.log('start: ', startDate);
  console.log('end: ', endEate);
  console.log('daterange: ', dateRange);

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['items', mode],
    ({ pageParam }) => getItems({ mode, cursor: pageParam }),
    {
      initialData: {
        pageParams: [undefined],
        pages: [initialData],
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return null;
        return lastPage.pageInfo.endCursor;
      },
    },
  );

  useEffect(() => {
    const nextUrl = mode === 'trending' ? '/' : `/?mode=${mode}`;
    navigate(nextUrl, { replace: true });
  }, [mode, navigate]);

  const fetchNext = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  useInfinityScroll(loadMoreRef, fetchNext);

  const items = data?.pages.flatMap((page) => page.list);

  console.log('pages: ', items);

  return (
    <TabLayout>
      <ListModeSelector mode={mode} onSelectMode={setMode} />
      {mode === 'past' && <WeekSelector dateRange={dateRange} />}
      {items && <LinkCardList items={items} />}
      <div
        ref={loadMoreRef}
        className="bg-violet-600 p-2 text-lg font-semibold text-white"
      >
        More Load
      </div>
    </TabLayout>
  );
}
