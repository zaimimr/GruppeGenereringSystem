import * as React from 'react';
import { IUser } from 'utils/types';

/**
 * UserContext
 * @category Context
 * @property {ICsvData[]} useSetUser Global useState with userinformation
 */

type Context = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useSetUser: any;
};

const UserContext = React.createContext<Context>({
  // eslint-disable-next-line
  useSetUser: [[], () => {}],
});

export const useSetUser = () => React.useContext(UserContext).useSetUser;

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<IUser | null>(null);
  const userContext = {
    useSetUser: [user, setUser],
  };

  return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
}
