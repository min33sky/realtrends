import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useFetcher, useNavigate } from '@remix-run/react';
import React, { useEffect, useState } from 'react';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import LabelTextArea from '~/components/system/LabelTextArea';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';
import { useWriteContext } from '~/contexts/WriteContext';
import { createItem } from '~/lib/api/items';
import { applyAuth } from '~/lib/applyAuth';
import { extractError, useAppErrorCatch } from '~/lib/error';

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

  try {
    // api 호출
    const item = await createItem({ link, title, body });
    return redirect(`/items/${item.id}}`);
  } catch (e) {
    const error = extractError(e);
    throw json(error, {
      status: error.statusCode,
    });
  }
};

export default function Intro() {
  const { state, actions } = useWriteContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //? Remix Form 다루기...
  //? 이전 페이지에서 입력한 link와 url과 현재 페이지의 데이터를 합해서 API 요청을 보내기 때문에
  //? Remix의 useSubmit이나 Form 대신 useFetcher를 사용하였다.
  const fetcher = useFetcher();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    actions.change(name as 'title' | 'body', value);
  };

  return (
    <BasicLayout title="뉴스 소개" hasBackButton>
      <WriteFormTemplate
        description="공유할 뉴스를 소개하세요"
        buttonText="등록하기"
        onSubmit={(e) => {
          e.preventDefault();
          if (state.form.title === '' || state.form.body === '') {
            setErrorMessage('제목과 내용을 모두 입력해주세요.');
            return;
          }
          fetcher.submit(state.form, {
            method: 'post',
          });
        }}
      >
        <div aria-label="group" className="flex flex-1 flex-col gap-4 pb-4">
          <LabelInput
            label="제목"
            name="title"
            value={state.form.title}
            onChange={onChange}
          />
          <LabelTextArea
            label="내용"
            name="body"
            value={state.form.body}
            onChange={onChange}
          />
          {errorMessage && (
            <div className="mt-2 text-center text-sm text-red-500">
              {errorMessage}
            </div>
          )}
        </div>
      </WriteFormTemplate>
    </BasicLayout>
  );
}

export function CatchBoundary() {
  const caught = useAppErrorCatch();
  const { actions } = useWriteContext();
  const navigate = useNavigate();

  //? 에러가 발생했을 시 이전 페이지 (링크 입력 페이지)로 이동시킨다.
  useEffect(() => {
    if (caught.status === 422) {
      navigate(-1);
      actions.setError(caught.data);
    }
  }, [actions, caught, navigate]);

  return <Intro />;
}
