import { Form, useActionData, useTransition } from '@remix-run/react';
import { useMemo } from 'react';
import { useFormLoading } from '~/hooks/useFormLoading';
import type { AppError } from '~/lib/error';
import Button from './Button';
import LabelInput from './LabelInput';
import QuestionLink from './QuestionLink';

interface Props {
  mode: 'login' | 'register';
  error?: AppError;
}

interface ActionData {
  text: 'hello world';
}

const authDescription = {
  login: {
    usernamePlaceholder: '아이디를 입력하세요.',
    passwordPlaceholder: '비밀번호를 입력하세요.',
    buttonText: '로그인',
    actionText: '회원가입',
    question: '계정이 없으신가요?',
    to: '/register',
  },
  register: {
    usernamePlaceholder: '5~20자 사이의 영문 소문자, 숫자 입력',
    passwordPlaceholder: '8자 이상, 영문/숫자/특수문자 중 2가지 이상 입력',
    buttonText: '회원가입',
    actionText: '로그인',
    question: '계정이 이미 있으신가요?',
    to: '/login',
  },
};

function AuthForm({ mode, error }: Props) {
  const action = useActionData<ActionData | undefined>();
  const isLoading = useFormLoading();

  const usernameErrorMessage = useMemo(() => {
    if (error?.name === 'UserExistsError') {
      return '이미 존재하는 계정입니다.';
    }
  }, [error]);

  const {
    actionText,
    buttonText,
    passwordPlaceholder,
    question,
    to,
    usernamePlaceholder,
  } = authDescription[mode];

  return (
    <Form method="post" className="flex flex-1 flex-col justify-between p-4">
      <div className="flex flex-col space-y-4">
        <LabelInput
          label="아이디"
          name="username"
          placeholder={usernamePlaceholder}
          disabled={isLoading}
          errorMessage={usernameErrorMessage}
        />
        <LabelInput
          label="비밀번호"
          name="password"
          placeholder={passwordPlaceholder}
          disabled={isLoading}
        />
      </div>

      <footer className="flex flex-col items-center space-y-4">
        <Button type="submit" layoutMode="fullWidth" disabled={isLoading}>
          {buttonText}
        </Button>
        <QuestionLink question={question} name={actionText} to={to} />
      </footer>
    </Form>
  );
}

export default AuthForm;
