import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import React from 'react';
import { checkIsLoggedIn } from '~/lib/protectRoute';

export const loader: LoaderFunction = async ({ request }) => {
  const isLoggedIn = await checkIsLoggedIn(request);
  if (isLoggedIn) return redirect('/');
  return null;
};

export default function Auth() {
  return <Outlet />;
}
