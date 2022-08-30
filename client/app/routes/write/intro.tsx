import React from 'react';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import LabelTextArea from '~/components/system/LabelTextArea';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';

export default function Intro() {
  return (
    <BasicLayout title="뉴스 소개" hasBackButton>
      <WriteFormTemplate
        description="공유할 뉴스를 소개하세요"
        buttonText="등록하기"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const title = formData.get('title') as string;
          const body = formData.get('body') as string;
          console.log('title, body:', title, body);
        }}
      >
        <div aria-label="group" className="flex flex-1 flex-col gap-4 pb-4">
          <LabelInput label="제목" name="title" />
          <LabelTextArea label="내용" name="body" />
        </div>
      </WriteFormTemplate>
    </BasicLayout>
  );
}
