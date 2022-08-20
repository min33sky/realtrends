import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import AuthForm from '~/components/AuthForm';
import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import Layout from '~/components/Layout';
import useGoBack from '~/hooks/useGoBack';
import { register } from '~/lib/api/auth';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');

  if (typeof username !== 'string' || typeof password !== 'string') return;
  const { result, cookieHeader } = await register({ username, password });

  const headers = new Headers();
  headers.append('Set-Cookie', cookieHeader[0]);
  headers.append('Set-Cookie', cookieHeader[1]);

  return json(result, { headers });
};

function Register() {
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

export default Register;
