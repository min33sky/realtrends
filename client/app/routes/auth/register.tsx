import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { ThrownResponse } from '@remix-run/react';
import { useActionData } from '@remix-run/react';
import { useCatch } from '@remix-run/react';
import AuthForm from '~/components/auth/AuthForm';
import type { AppError } from '~/lib/error';
import { extractError } from '~/lib/error';
import type { AuthResult } from '~/lib/api/auth';
import { register } from '~/lib/api/auth';
import BasicLayout from '~/components/layout/BasicLayout';
import { useAuthRedirect } from '~/hooks/useAuthRedirect';
import { useSetUser } from '~/states/user';
import { useEffect } from 'react';

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
  useAuthRedirect();

  const actionData = useActionData<AuthResult>();
  const setUser = useSetUser();

  useEffect(() => {
    if (!actionData) return;
    setUser(actionData.user);
  }, [actionData, setUser]);

  return (
    <BasicLayout title="회원가입" hasBackButton desktopHeaderVisible={false}>
      <AuthForm mode="register" error={error} />
    </BasicLayout>
  );
}

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<number, AppError>>();

  return <Register error={caught.data} />;
}
