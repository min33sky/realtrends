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
  const { mode, start, end } = parseUrlParams<{
    mode?: string;
    start?: string;
    end?: string;
  }>(request.url);

  const fallbackedMode = mode ?? 'trending';

  const range = mode === 'past' ? getWeekRangeFromDate(new Date()) : undefined;

  //? URL parsing값을 우선으로 사용함
  const startDate = start ?? range?.[0];
  const endDate = end ?? range?.[1];

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<ListMode>(
    (searchParams.get('mode') as any) ?? 'trending',
  );
  const defaultDateRange = useMemo(() => getWeekRangeFromDate(new Date()), []);
  const startDate = searchParams.get('start');
  const endEate = searchParams.get('end');
  const [dateRange, setDateRange] = useState(
    startDate && endEate ? [startDate, endEate] : defaultDateRange,
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  //? URL의 startDate, endDate가 변경되면 dateRange를 변경함
  useEffect(() => {
    if (mode === 'past') {
      setDateRange(
        startDate && endEate ? [startDate, endEate] : defaultDateRange,
      );
    }
  }, [defaultDateRange, endEate, mode, startDate]);

  //? tab이 변경되면 URL을 Parsing해서 Mode의 상태값을 변경한다.
  useEffect(() => {
    const nextMode = (searchParams.get('mode') as ListMode) ?? 'trending';
    if (nextMode !== mode) {
      setMode(nextMode);
    }
  }, [mode, searchParams]);

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    // ['items', mode, mode === 'past' ? { dateRange } : undefined].filter((item) => !!item),
    ['items', mode, mode === 'past' && { dateRange }],
    ({ pageParam }) =>
      getItems({
        mode,
        cursor: pageParam,
        ...(mode === 'past'
          ? { startDate: dateRange[0], endDate: dateRange[1] }
          : {}),
      }),
    {
      initialData: {
        pageParams: [undefined],
        pages: [initialData],
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.endCursor;
      },
    },
  );

  const fetchNext = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  useInfinityScroll(loadMoreRef, fetchNext);

  const items = data?.pages.flatMap((page) => page.list);

  console.log('pages: ', items);

  const onSelectMode = (mode: ListMode) => {
    setSearchParams({ mode });
  };

  return (
    <TabLayout>
      <ListModeSelector mode={mode} onSelectMode={onSelectMode} />
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
