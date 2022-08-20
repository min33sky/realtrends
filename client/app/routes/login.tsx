import AuthForm from '~/components/AuthForm';
import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import Layout from '~/components/Layout';
import useGoBack from '~/hooks/useGoBack';

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
