import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import type { User } from './lib/api/auth';
import { getMyAcoount } from './lib/api/auth';
import { setClientCookie } from './lib/client';
import styles from './styles/app.css';

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  console.log('cookie: ', cookie);
  if (!cookie) return null;
  setClientCookie(cookie);
  const me = await getMyAcoount();
  return me;
};

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  const data = useLoaderData<User | null>();
  console.log('data', data);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
