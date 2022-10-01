import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useDialog } from '~/contexts/DialogContext';
import { changePassword, unregister } from '~/lib/api/me';
import { extractNextError } from '~/lib/nextError';
import { useUser } from '~/states/user';
import Button from '../system/Button';
import Input from '../system/Input';

export default function AccountSetting() {
  const user = useUser();

  const [form, setForm] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const { open } = useDialog();

  const reset = () => {
    setForm({
      oldPassword: '',
      newPassword: '',
    });
  };

  const { mutate: mutateChangePassword } = useMutation(changePassword, {
    onSuccess: () => {
      open({
        title: '비밀번호 변경',
        description: '비밀번호가 변경되었습니다.',
      });
      reset();
    },

    onError: (e) => {
      const error = extractNextError(e);
      reset();
      if (error.name === 'BadRequest') {
        open({
          title: '비밀번호 변경',
          description:
            '8자 이상, 영문/숫자/특수문자 중 2가지 이상 입력해주세요.',
        });
      } else if (error.name === 'Forbidden') {
        open({
          title: '비밀번호 변경',
          description: '비밀번호가 일치하지 않습니다.',
        });
      }
    },
  });

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutateChangePassword(form);
  };

  const askUnregister = () => {
    open({
      title: '계정 탈퇴',
      description: '정말로 탈퇴하시겠습니까?',
      mode: 'YESNO',
      confirmText: '탈퇴',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          await unregister();
        } catch (error) {}
        window.location.href = '/';
      },
    });
  };

  if (!user) return null;

  return (
    <article className="flex flex-1 flex-col justify-between p-4 xs:mx-auto xs:mt-24 xs:max-w-3xl xs:flex-initial">
      <div>
        <h1 className="mb-8 text-5xl font-extrabold text-gray-800">내 계정</h1>
        <section className="xs:w-[460px]">
          <h4 className="mt-0 mb-2 text-base text-gray-400">아이디</h4>
          <div className="text-base text-gray-500">{user.username}</div>
        </section>

        <section className="mt-8 xs:w-[460px]">
          <h4 className="mt-0 mb-2 text-base text-gray-400">비밀번호</h4>
          <form onSubmit={onSubmit}>
            <div className="mb-2 flex flex-col gap-2">
              <Input
                placeholder="현재 비밀번호"
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={onChange}
              />
              <Input
                placeholder="새 비밀번호"
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={onChange}
              />
            </div>
            <Button variant="secondary">비밀번호 변경</Button>
          </form>
        </section>
      </div>

      <footer className="xs:mt-24">
        <button className="text-base text-red-600" onClick={askUnregister}>
          계정 탈퇴
        </button>
      </footer>
    </article>
  );
}
