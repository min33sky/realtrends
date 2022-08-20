import LabelInput from './LabelInput';

interface Props {
  mode: 'login' | 'register';
}

function AuthForm({ mode }: Props) {
  return (
    <div className="flex-1 space-y-4 p-4">
      <LabelInput label="아이디" />
      <LabelInput label="비밀번호" />
    </div>
  );
}

export default AuthForm;
