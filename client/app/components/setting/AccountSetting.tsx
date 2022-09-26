import React from 'react';
import { useUser } from '~/states/user';
import Button from '../system/Button';
import Input from '../system/Input';

export default function AccountSetting() {
  const user = useUser();
  if (!user) return null;

  return (
    <article className="flex flex-1 flex-col justify-between p-4">
      <div>
        <section>
          <h4 className="mt-0 mb-2 text-base text-gray-400">아이디</h4>
          <div className="text-base text-gray-500">{user.username}</div>
        </section>
        <section className="mt-8">
          <h4 className="mt-0 mb-2 text-base text-gray-400">비밀번호</h4>
          <div className="mb-2 flex flex-col gap-2">
            <Input placeholder="현재 비밀번호" type="password" />
            <Input placeholder="새 비밀번호" type="password" />
          </div>
          <Button variant="secondary">비밀번호 변경</Button>
        </section>
      </div>
      <div>
        <button className="text-base text-red-600">계정 탈퇴</button>
      </div>
    </article>
  );
}
