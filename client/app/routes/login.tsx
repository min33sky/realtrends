import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import useGoBack from '~/hooks/useGoBack';

function Login() {
  const goBack = useGoBack();

  return (
    <div>
      <Header
        title="로그인"
        headerLeft={<HeaderBackButton onClick={goBack} />}
      />
    </div>
  );
}

export default Login;
