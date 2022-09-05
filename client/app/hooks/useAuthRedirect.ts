import { useActionData, useNavigate, useSearchParams } from '@remix-run/react';
import type { CatchValue } from '@remix-run/react/dist/transition';
import { useEffect } from 'react';
import type { AuthResult } from '~/lib/api/auth';

export function useAuthRedirect() {
  const authResult = useActionData<AuthResult | CatchValue>();

  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') ?? '/';
  const navigate = useNavigate();

  //? Remix에서 액션 실패시 CatchValue 타입의 값이 반환된다.
  //? 이 값을 이용해서 인증 실패시 리다이렉트를 막는다.

  useEffect(() => {
    if (!authResult) return;
    if ('status' in authResult) return; //? login failed
    navigate(next);
  }, [authResult, navigate, next]);
}
