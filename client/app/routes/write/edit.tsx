import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import React, { useState } from 'react';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import LabelTextArea from '~/components/system/LabelTextArea';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';
import { getItem, updateItem } from '~/lib/api/items';
import type { Item } from '~/lib/api/types';
import { parseUrlParams } from '~/lib/parseUrlParams';

export const loader: LoaderFunction = async ({ request }) => {
  // TODO: validate itemId
  const query = parseUrlParams<{ itemId: string }>(request.url);
  const itemId = parseInt(query.itemId, 10);
  const item = await getItem(itemId);
  return json(item);
};

export default function EditPage() {
  const item = useLoaderData<Item>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: item.title,
    body: item.body,
  });

  const onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const name = e.target.name as 'title' | 'body';
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //? Remix의 action을 이용한 SUbmit를 사용 안할꺼임
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    //TODO: handle loading and error
    await updateItem({
      itemId: item.id,
      ...form,
    });
    navigate(`/items/${item.id}`);
  };

  const errorMessage = null;

  return (
    <BasicLayout title="수정" hasBackButton>
      <WriteFormTemplate buttonText="수정하기" onSubmit={onSubmit}>
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
