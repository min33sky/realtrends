import { useNavigate } from '@remix-run/react';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';
import { useWriteContext } from '~/contexts/WriteContext';

export default function WriteLink() {
  const navigate = useNavigate();
  const { actions, state } = useWriteContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    actions.change('link', value);
  };

  return (
    <BasicLayout title="링크 입력" hasBackButton>
      <WriteFormTemplate
        description="공유하고 싶은 URL을 입력하세요."
        buttonText="다음"
        onSubmit={(e) => {
          //? 여기서 바로 Submit 하지 않고 다음 페이지에서도 입력을 받아야 하므로
          //? e.preventDefault()를 사용해 Remix 기본 Form 처리 방식을 막는다.
          e.preventDefault();
          //? Remix는 uncontrolled 방식을 사용하지만 여기선 controlled 방식을 사용함
          // const formData = new FormData(e.currentTarget);
          // const link = formData.get('link') as string;
          // console.log('link: ', link);
          navigate('/write/intro');
        }}
      >
        <LabelInput
          name="link"
          label="URL"
          placeholder="http://example.com"
          value={state.form.link}
          onChange={onChange}
          errorMessage={
            state.error?.statusCode === 422
              ? '유효하지 않은 URL입니다.'
              : undefined
          }
        />
      </WriteFormTemplate>
      {/* <Button onClick={() => navigate('/write/intro')}>다음</Button> */}
    </BasicLayout>
  );
}
