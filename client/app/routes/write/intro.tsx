import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import React, { useState } from 'react';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import LabelTextArea from '~/components/system/LabelTextArea';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';
import { useWriteContext } from '~/contexts/WriteContext';
import { createItem } from '~/lib/api/items';
import { applyAuth } from '~/lib/applyAuth';

export const action: ActionFunction = async ({ request }) => {
  //? 요청을 보내기 전에 쿠키를 넣어줘야 한다. (쿠키를 알아서 넣어줬으면 좋겠는데.......)
  const applied = await applyAuth(request);
  if (!applied) {
    throw new Error('Not logged in!`');
  }

  const form = await request.formData();
  const link = form.get('link') as string;
  const title = form.get('title') as string;
  const body = form.get('body') as string;

  console.log({ link, title, body });

  try {
    // api 호출
    await createItem({ link, title, body });
    console.log('데이터 작성 성공~~~~~~~~~~~~~~~~~~~~~~~');
  } catch (error) {
    //...
  }

  return redirect('/');
};

export default function Intro() {
  const { state } = useWriteContext();
  const [form, setForm] = useState({
    link: state.link,
    title: '',
    body: '',
  });

  //? Remix Form 다루기...
  //? 이전 페이지에서 입력한 link와 url과 현재 페이지의 데이터를 합해서 API 요청을 보내기 때문에
  //? Remix의 useSubmit이나 Form 대신 useFetcher를 사용하였다.
  const fetcher = useFetcher();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <BasicLayout title="뉴스 소개" hasBackButton>
      <WriteFormTemplate
        description="공유할 뉴스를 소개하세요"
        buttonText="등록하기"
        onSubmit={(e) => {
          e.preventDefault();
          fetcher.submit(
            {
              ...form,
            },
            {
              method: 'post',
            },
          );
          console.log('title, body, link:', form.title, form.body, state.link);
        }}
      >
        <div aria-label="group" className="flex flex-1 flex-col gap-4 pb-4">
          <LabelInput
            label="제목"
            name="title"
            value={form.title}
            onChange={onChange}
          />
          <LabelTextArea
            label="내용"
            name="body"
            value={form.body}
            onChange={onChange}
          />
        </div>
      </WriteFormTemplate>
    </BasicLayout>
  );
}
