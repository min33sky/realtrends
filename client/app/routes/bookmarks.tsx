import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useRef } from 'react';
import LinkCardList from '~/components/home/LinkCardList';
import TabLayout from '~/components/layout/TabLayout';
import { useInfinityScroll } from '~/hooks/useInfinityScroll';
import { getBookmarks } from '~/lib/api/bookmark';
import type { GetBookmarksResult } from '~/lib/api/types';
import { checkIsLoggedIn } from '~/lib/protectRoute';

export const loader: LoaderFunction = async ({ request }) => {
  const isLoggedIn = await checkIsLoggedIn(request);
  if (!isLoggedIn) return redirect('/auth/login?redirect=/bookmarks');
  const bookmarks = await getBookmarks();

  return json(bookmarks);
};

export default function Bookmarks() {
  const initialData = useLoaderData<GetBookmarksResult>();
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(
    ['bookmarks'],
    ({ pageParam }) => getBookmarks(pageParam),
    {
      initialData: {
        pageParams: [undefined],
        pages: [initialData],
      },
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.nextOffset;
      },
    },
  );

  useInfinityScroll(loaderRef, fetchNextPage);

  const items = data?.pages.flatMap((page) =>
    page.list.map((bookamrk) => bookamrk.item),
  );

  return (
    <TabLayout>
      {items ? <LinkCardList items={items} /> : null}
      <div ref={loaderRef}></div>
    </TabLayout>
  );
}
