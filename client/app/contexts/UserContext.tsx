import { createContext, useContext } from 'react';
import type { User } from '~/lib/api/auth';

/**
 * null: not logged in
 * User: logged in
 * undefined: UserContext.Provider not used
 */
export const UserContext = createContext<User | null | undefined>(undefined);

//? Provider는 Root에 위치시킨다. Loader 함수에서 사용자 정보를 받아와서 Provider의 value에 넣어준다.

export function useUser() {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error('UserContext.Provider not used');
  }
  return user;
}
