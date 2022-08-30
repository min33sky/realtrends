import { useNavigate } from '@remix-run/react';
import BasicLayout from '~/components/layout/BasicLayout';
import Button from '~/components/system/Button';
import LabelInput from '~/components/system/LabelInput';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';
import { useWriteContext } from '~/contexts/WriteContext';

export default function WriteLink() {
  const navigate = useNavigate();
  const { actions, state } = useWriteContext();

  return (
    <BasicLayout title="링크 입력" hasBackButton>
      <WriteFormTemplate
        description="공유하고 싶은 URL을 입력하세요."
        buttonText="다음"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const url = formData.get('url') as string;
          console.log('url: ', url);
          actions.setUrl(url);
          navigate('/write/intro');
        }}
      >
        <LabelInput
          name="url"
          label="URL"
          placeholder="http://example.com"
          defaultValue={state.url}
        />
      </WriteFormTemplate>
      {/* <Button onClick={() => navigate('/write/intro')}>다음</Button> */}
    </BasicLayout>
  );
}
