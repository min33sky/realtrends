import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { ThrownResponse } from '@remix-run/react';
import { useCatch } from '@remix-run/react';
import AuthForm from '~/components/auth/AuthForm';
import Header from '~/components/base/Header';
import HeaderBackButton from '~/components/base/HeaderBackButton';
import FullHeightLayout from '~/components/system/FullHeightLayout';
import useGoBack from '~/hooks/useGoBack';
import { login } from '~/lib/api/auth';
import type { AppError } from '~/lib/error';
import { extractError } from '~/lib/error';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');

  if (typeof username !== 'string' || typeof password !== 'string') return;

  try {
    const { result, headers } = await login({ username, password });
    return json(result, { headers });
  } catch (e) {
    const error = extractError(e);
    throw json(error, { status: error.statusCode });
  }
};

interface Props {
  error?: AppError;
}

export default function Login({ error }: Props) {
  const goBack = useGoBack();

  return (
    <FullHeightLayout>
      <Header
        title="로그인"
        headerLeft={<HeaderBackButton onClick={goBack} />}
      />
      <AuthForm mode="login" error={error} />
    </FullHeightLayout>
  );
}

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, AppError>>();
  console.log(caught);

  return <Login error={caught.data} />;
}
