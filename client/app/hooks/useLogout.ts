import { logout } from '~/lib/api/auth';

export default function useLogout() {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      //
    }
    window.location.href = '/';
  };

  return handleLogout;
}
