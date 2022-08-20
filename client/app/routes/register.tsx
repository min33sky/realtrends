import AuthForm from '~/components/AuthForm';
import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import Layout from '~/components/Layout';
import useGoBack from '~/hooks/useGoBack';

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
