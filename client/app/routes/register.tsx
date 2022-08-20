import Header from '~/components/Header';
import HeaderBackButton from '~/components/HeaderBackButton';
import useGoBack from '~/hooks/useGoBack';

function Register() {
  const goBack = useGoBack();

  return (
    <div>
      <Header
        title="회원가입"
        headerLeft={<HeaderBackButton onClick={goBack} />}
      />
    </div>
  );
}

export default Register;
