import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { useEffect } from 'react';
import { useForm } from '~/hooks/useForm';
import { useSubmitLoading } from '~/hooks/useSubmitLoading';
import type { AppError } from '~/lib/error';
import { validate } from '~/lib/validate';
import Button from '../system/Button';
import LabelInput from '../system/LabelInput';
import { Logo } from '../vectors';
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
    to: '/auth/register',
  },
  register: {
    usernamePlaceholder: '5~20자 사이의 영문 소문자, 숫자 입력',
    passwordPlaceholder: '8자 이상, 영문/숫자/특수문자 중 2가지 이상 입력',
    buttonText: '회원가입',
    actionText: '로그인',
    question: '계정이 이미 있으신가요?',
    to: '/auth/login',
  },
};

function AuthForm({ mode, error }: Props) {
  const action = useActionData<ActionData | undefined>();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next');

  const isLoading = useSubmitLoading();

  const { inputProps, handleSubmit, errors, setError } = useForm({
    form: {
      username: {
        validate: mode === 'register' ? validate.username : undefined,
        errorMessage: '5~20자 사이의 영문 소문자 또는 숫자를 입력해주세요.',
      },
      password: {
        validate: mode === 'register' ? validate.password : undefined,
        errorMessage:
          '8자 이상, 영문/숫자/특수문자 중 2가지 이상 입력해주세요.',
      },
    },
    mode: 'all',
    shouldPreventDefault: false,
  });

  const {
    actionText,
    buttonText,
    passwordPlaceholder,
    question,
    to,
    usernamePlaceholder,
  } = authDescription[mode];

  const onSubmit = handleSubmit(() => {});

  useEffect(() => {
    if (error?.name === 'UserExistsError') {
      setError('username', '이미 존재하는 계정입니다.');
    }
  }, [error, setError]);

  return (
    <Form
      method="post"
      className="flex flex-1 flex-col justify-between p-4 xs:w-[460px] xs:justify-center xs:self-center"
      onSubmit={onSubmit}
    >
      <Link to="/" className="mb-12 hidden justify-center xs:flex">
        <Logo className="h-8 w-auto text-gray-500" />
      </Link>

      <div aria-label="input-group" className="flex flex-col space-y-4 ">
        <LabelInput
          label="아이디"
          name="username"
          placeholder={usernamePlaceholder}
          disabled={isLoading}
          errorMessage={errors.username || undefined}
          {...inputProps.username}
        />

        <LabelInput
          label="비밀번호"
          name="password"
          type="password"
          placeholder={passwordPlaceholder}
          disabled={isLoading}
          errorMessage={errors.password || undefined}
          {...inputProps.password}
        />
      </div>

      <footer
        aria-label="actionsBox"
        className="flex flex-col items-center space-y-4 xs:mt-6"
      >
        {error?.name === 'AuthenticationError' && (
          <div className="text-sm text-red-500">잘못된 계정 정보입니다.</div>
        )}
        <Button type="submit" layoutMode="fullWidth" disabled={isLoading}>
          {buttonText}
        </Button>
        <QuestionLink
          question={question}
          name={actionText}
          to={next ? `${to}?next=${next}` : to}
        />
      </footer>
    </Form>
  );
}

export default AuthForm;
