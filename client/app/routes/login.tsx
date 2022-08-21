import type { ActionFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import AuthForm from '~/components/AuthForm';
import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import Layout from '~/components/Layout';
import useGoBack from '~/hooks/useGoBack';
import { login } from '~/lib/api/auth';

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const password = form.get('password');

  if (typeof username !== 'string' || typeof password !== 'string') return;
  const { result, headers } = await login({ username, password });

  return json(result, { headers });
};

function Login() {
  const goBack = useGoBack();

  return (
    <Layout>
      <Header
        title="로그인"
        headerLeft={<HeaderBackButton onClick={goBack} />}
      />
      <AuthForm mode="login" />
    </Layout>
  );
}

export default Login;
