import { Form, useActionData, useTransition } from '@remix-run/react';
import { useMemo, useState } from 'react';
import { useSubmitLoading } from '~/hooks/useSubmitLoading';
import type { AppError } from '~/lib/error';
import { isValidPassword, isValidUsername } from '~/lib/regex';
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
  const isLoading = useSubmitLoading();
  const [isInvalidUsername, setIsInvalidUsername] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  const usernameErrorMessage = useMemo(() => {
    if (isInvalidUsername) {
      return '5~20자 사이의 영문 소문자, 숫자 입력해주세요';
    }
    if (error?.name === 'UserExistsError') {
      return '이미 존재하는 계정입니다.';
    }
  }, [error, isInvalidUsername]);

  const {
    actionText,
    buttonText,
    passwordPlaceholder,
    question,
    to,
    usernamePlaceholder,
  } = authDescription[mode];

  return (
    <Form
      method="post"
      className="flex flex-1 flex-col justify-between p-4"
      onSubmit={(e) => {
        if (mode !== 'register') return;

        const form = new FormData(e.currentTarget);
        const username = form.get('username');
        const password = form.get('password');
        if (typeof username !== 'string' || typeof password !== 'string') {
          e.preventDefault();
          return;
        }
        if (!isValidUsername(username) || !isValidPassword(password)) {
          e.preventDefault();
          return;
        }
      }}
    >
      <div className="flex flex-col space-y-4">
        <LabelInput
          label="아이디"
          name="username"
          placeholder={usernamePlaceholder}
          disabled={isLoading}
          onBlur={(e) => {
            if (mode !== 'register') return;
            setIsInvalidUsername(!isValidUsername(e.target.value));
          }}
          errorMessage={usernameErrorMessage}
        />
        <LabelInput
          label="비밀번호"
          name="password"
          placeholder={passwordPlaceholder}
          disabled={isLoading}
          onBlur={(e) => {
            if (mode !== 'register') return;
            setIsInvalidPassword(!isValidPassword(e.currentTarget.value));
          }}
          errorMessage={
            isInvalidPassword
              ? '8자 이상, 영문/숫자/특수문자 중 2가지 이상 입력해주세요.'
              : undefined
          }
        />
      </div>

      <footer className="flex flex-col items-center space-y-4">
        {error?.name === 'AuthenticationError' && (
          <div className="text-sm text-red-500">잘못된 계정 정보입니다.</div>
        )}
        <Button type="submit" layoutMode="fullWidth" disabled={isLoading}>
          {buttonText}
        </Button>
        <QuestionLink question={question} name={actionText} to={to} />
      </footer>
    </Form>
  );
}

export default AuthForm;
