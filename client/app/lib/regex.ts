export function isValidUsername(username: string) {
  return /^[a-z0-9]{5,20}$/.test(username);
}

export function isValidPassword(password: string) {
  if (password.length < 8) return false;

  //? 해당 조건에서 2가지 이상 만족하면 true를 리턴한다.
  const passwordRules = [/[a-zA-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
  const counter = passwordRules.reduce((acc, current) => {
    if (current.test(password)) {
      acc += 1;
    }
    return acc;
  }, 0);

  return counter > 1;
}
