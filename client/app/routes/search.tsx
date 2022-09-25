import React, { useCallback, useEffect, useRef, useState } from 'react';
import MobileHeader from '~/components/base/MobileHeader';
import TabLayout from '~/components/layout/TabLayout';
import SearchInput from '~/components/search/SearchInput';
import { useDebounce } from 'use-debounce';
import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { parseUrlParams } from '~/lib/parseUrlParams';
import { searchItems } from '~/lib/api/search';
import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import type { SearchItemsResult } from '~/lib/api/types';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInfinityScroll } from '~/hooks/useInfinityScroll';
import { stringify } from 'qs';
import SearchResultCardList from '~/components/search/SearchResultCardList';
import DesktopHeader from '~/components/base/DesktopHeader';

export const loader: LoaderFunction = async ({ request }) => {
  const { q } = parseUrlParams<{ q?: string }>(request.url);
  if (!q) {
    return json({
      list: [],
      totalCOunt: 0,
      pageInfo: {
        nextOffset: null,
        hasNextPage: false,
      },
    });
  }

  // TODO: handler errors
  const searchResult = await searchItems({ q });
  return json(searchResult);
};

export default function Search() {
  const data = useLoaderData<SearchItemsResult>();
  const [searchParams] = useSearchParams(); //? 새로고침시 querystring이 사라지는 걸 막기 위해
  const [searchText, setSearchText] = useState(searchParams.get('q') ?? '');
  const [deboundcedSearchText] = useDebounce(searchText, 300);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    hasNextPage,
    data: infiniteData,
    fetchNextPage,
  } = useInfiniteQuery(
    ['searchResults', deboundcedSearchText],
    ({ pageParam }) =>
      searchItems({ q: deboundcedSearchText, offset: pageParam }),
    {
      enabled: !!deboundcedSearchText,
      getNextPageParam: (lastPage, pages) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.nextOffset;
      },
      initialData: {
        pageParams: [undefined],
        pages: [data],
      },
    },
  );

  //? 검색이 제대로 안되는 현상을 막기 위한 코드인데 이렇게 하는 것이 맞는것인가
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.setQueriesData(['searchResults', deboundcedSearchText], {
      pageParams: [undefined],
      pages: [data],
    });
  }, [data, deboundcedSearchText, queryClient]);

  const fetchNext = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage]);

  useInfinityScroll(loadMoreRef, fetchNext);

  useEffect(() => {
    navigate('/search?' + stringify({ q: deboundcedSearchText }));
  }, [deboundcedSearchText, navigate]);

  const items = infiniteData?.pages.flatMap((page) => page.list);

  return (
    <TabLayout
      header={
        <>
          <MobileHeader
            title={
              <SearchInput value={searchText} onChangeText={setSearchText} />
            }
            titleFullWidth
          />
          <DesktopHeader />
        </>
      }
    >
      <SearchResultCardList items={items || []} />
      <div
        ref={loadMoreRef}
        className="bg-violet-600 p-2 text-lg font-semibold text-white"
      >
        More Load
      </div>
    </TabLayout>
  );
}
