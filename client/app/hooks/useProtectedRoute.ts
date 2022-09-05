import { useNavigate } from '@remix-run/react';
import { useEffect } from 'react';
import { useUser } from '~/contexts/UserContext';

/**
 * Client에서 인증이 필요한 페이지를 접근할 때 사용하는 Hook
 * ? remix 서버에서 인증 처리하는 방식을 사용하므로 일단 사용 안함
 */
export function useProtectedRoute() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth/login?redirect=/write');
    }
  }, [navigate, user]);

  return !!user;
}
