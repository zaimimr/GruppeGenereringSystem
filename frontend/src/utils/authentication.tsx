import { useSetUser } from 'context/UserContext';
import React from 'react';
import { useCookies } from 'react-cookie';
import { getUserWithToken, setAuthHeader, verifyToken } from 'utils/axios';

import { IUser } from './types';

export const useAuth = () => {
  const [hasAuth, setHasAuth] = React.useState(false);
  const [cookies, , removeCookie] = useCookies(['access_token']);
  const [user, setUser] = useSetUser();
  React.useEffect(() => {
    setAuthHeader(cookies.access_token || '');
    if (hasAuth) {
      verifyToken().catch(() => {
        removeCookie('access_token');
        setHasAuth(false);
      });
    } else {
      getUserWithToken()
        .then((response: { data: { user: IUser } }) => {
          setUser(response.data.user);
          setHasAuth(true);
        })
        .catch(() => {
          removeCookie('access_token');
          setHasAuth(false);
        });
    }
    // eslint-disable-next-line
  }, [cookies.access_token, user]);
  return hasAuth;
};
