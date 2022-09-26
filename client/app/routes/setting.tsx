import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import TabLayout from '~/components/layout/TabLayout';
import { checkIsLoggedIn } from '~/lib/protectRoute';

export const loader: LoaderFunction = async ({ request }) => {
  const isLoggedIn = await checkIsLoggedIn(request);
  if (!isLoggedIn) {
    return redirect('/auth/login?next=/setting');
  }
  return null;
};

export default function Setting() {
  return <Outlet />;
}
