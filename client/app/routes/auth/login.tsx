import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { ThrownResponse } from '@remix-run/react';
import { useActionData } from '@remix-run/react';
import { useCatch } from '@remix-run/react';
import { useEffect } from 'react';
import AuthForm from '~/components/auth/AuthForm';
import BasicLayout from '~/components/layout/BasicLayout';
import { useAuthRedirect } from '~/hooks/useAuthRedirect';
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
    console.log('로그인 실패: ', e);
    throw json(error, { status: error.statusCode });
  }
};

interface Props {
  error?: AppError;
}

export default function Login({ error }: Props) {
  const actionData = useActionData();
  useAuthRedirect();

  useEffect(() => {
    if (!actionData) return;
  }, [actionData]);

  return (
    <BasicLayout title="로그인" hasBackButton>
      <AuthForm mode="login" error={error} />
    </BasicLayout>
  );
}

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, AppError>>();

  console.log(caught);

  return <Login error={caught.data} />;
}
