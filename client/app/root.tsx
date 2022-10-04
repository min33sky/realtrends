import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import DialogProvider from './contexts/DialogContext';
import type { User } from './lib/api/auth';
import { setClientCookie } from './lib/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styles from './styles/app.css';
import GlobalBottomSheetModal from './components/system/GlobalBottomSheetModal';
import { SangteProvider } from 'sangte';
import { userState } from './states/user';
import { getMemoMyAccount } from './lib/protectRoute';

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get('cookie');

  if (!cookie) return null;

  // 사용자 정보 요청에 필요한 쿠키를 헤더에 설정
  setClientCookie(cookie);

  try {
    const { me, headers } = await getMemoMyAccount();
    return json(me, headers ? { headers } : {});
  } catch (e) {
    return json(null);
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 5, // 5초
    },
  },
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
        <SangteProvider
          initialize={({ set }) => {
            set(userState, data);
          }}
        >
          <QueryClientProvider client={queryClient}>
            <DialogProvider>
              <Outlet />
            </DialogProvider>
            <GlobalBottomSheetModal />
          </QueryClientProvider>
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </SangteProvider>
      </body>
    </html>
  );
}
