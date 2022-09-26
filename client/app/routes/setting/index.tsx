import { Link } from '@remix-run/react';
import TabLayout from '~/components/layout/TabLayout';
import useLogout from '~/hooks/useLogout';

export default function SettingPage() {
  const logout = useLogout();

  // TODO:  divide Style 변경해야함

  return (
    <TabLayout>
      <article className="flex-1 bg-gray-100">
        <div className="divide-y-2 divide-purple-500">
          <Link
            to="/setting/account"
            className="bg-white p-4 text-gray-500 active:opacity-70"
          >
            내 계정
          </Link>
          <div className="bg-white p-4 text-gray-500 active:opacity-70">
            로그아웃
          </div>
        </div>
      </article>
    </TabLayout>
  );
}
