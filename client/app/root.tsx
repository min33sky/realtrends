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
import DialogProvider from './contexts/DialogContext';
import type { User } from './lib/api/auth';
import { setClientCookie } from './lib/client';
import { extractError } from './lib/error';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import styles from './styles/app.css';
import GlobalBottomSheetModal from './components/system/GlobalBottomSheetModal';
import { SangteProvider } from 'sangte';
import { userState } from './states/user';
import { getMyAccount } from './lib/api/me';

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = request.headers.get('cookie');
  console.log('cookie: ', cookie);

  //? 인증이 필요한 페이지라면 리다이렉트 시키는 함수 (사용 안함!!)
  //? Why? 각 page의 loader 함수의 호출을 여기서 막을 수가 없다.
  // const redirectIfNeeded = () => {
  //   const { pathname, search } = new URL(request.url);
  //   console.log('pathname, search: ', pathname, search);
  //   const isProtected = PROTECTED_ROUTES.some((route) =>
  //     pathname.includes(route),
  //   );
  //   if (isProtected) {
  //     return redirect('/login?next=' + encodeURIComponent(pathname + search));
  //   }
  //   return null;
  // };

  if (!cookie) return null;

  //? 사용자 정보 요청에 필요한 쿠키를 헤더에 설정
  setClientCookie(cookie);

  try {
    const me = await getMyAccount();
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
