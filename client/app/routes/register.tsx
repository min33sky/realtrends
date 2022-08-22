import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { ThrownResponse } from '@remix-run/react';
import { useCatch } from '@remix-run/react';
import AuthForm from '~/components/AuthForm';
import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import Layout from '~/components/Layout';
import useGoBack from '~/hooks/useGoBack';
import type { AppError } from '~/lib/error';
import { extractError } from '~/lib/error';
import { register } from '~/lib/api/auth';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');

  if (typeof username !== 'string' || typeof password !== 'string') return;

  try {
    const { result, headers } = await register({ username, password });
    return json(result, { headers });
  } catch (e) {
    const error = extractError(e);
    throw json(error, { status: error.statusCode });
  }
};

interface Props {
  error?: AppError;
}

export default function Register({ error }: Props) {
  const goBack = useGoBack();

  return (
    <Layout>
      <Header
        title="회원가입"
        headerLeft={<HeaderBackButton onClick={goBack} />}
      />
      <AuthForm mode="register" error={error} />
    </Layout>
  );
}

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, AppError>>();

  return <Register error={caught.data} />;
}
