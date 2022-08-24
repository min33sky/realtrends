import type { LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import BasicLayout from '~/components/layout/BasicLayout';
import { checkIsLoggedIn } from '~/lib/protectRoute';

export const loader: LoaderFunction = async ({ request }) => {
  ///? 클라이언트에서 대신 서버에서 인증 관련 리다이렉트 처리하기
  const isLoggedIn = await checkIsLoggedIn(request);
  if (!isLoggedIn) return redirect('/login?next=/write');
  return null;
};

export default function Write() {
  return (
    <BasicLayout title="새 글 작성" hasBackButton>
      글 쓰는 곳
    </BasicLayout>
  );
}
