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
import { UserContext } from './contexts/UserContext';
import type { User } from './lib/api/auth';
import { getMyAcoount } from './lib/api/auth';
import { setClientCookie } from './lib/client';
import { extractError } from './lib/error';
import styles from './styles/app.css';

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  console.log('cookie: ', cookie);

  if (!cookie) return null;

  setClientCookie(cookie);

  try {
    const me = await getMyAcoount();
    return me;
  } catch (e) {
    const error = extractError(e);
    if (error.name === 'UnauthorizedError') {
      console.log(error.payload);
    }
    return null;
  }
};

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Realtrends',
  viewport: 'width=device-width,initial-scale=1',
});

export default function App() {
  const data = useLoaderData<User | null>();
  console.log('User-Data: ', data);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <UserContext.Provider value={data}>
          <Outlet />
        </UserContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
