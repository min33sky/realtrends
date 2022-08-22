import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useCatch } from '@remix-run/react';
import AuthForm from '~/components/AuthForm';
import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import Layout from '~/components/Layout';
import useGoBack from '~/hooks/useGoBack';
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

export default function Register() {
  const goBack = useGoBack();

  return (
    <Layout>
      <Header
        title="회원가입"
        headerLeft={<HeaderBackButton onClick={goBack} />}
      />
      <AuthForm mode="register" />
    </Layout>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  console.table(caught);
  return (
    <div>Register Error~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</div>
  );
}
