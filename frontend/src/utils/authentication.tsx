import { useEvents } from 'context/EventContext';
import { useSetUser } from 'context/UserContext';
import React from 'react';
import { useCookies } from 'react-cookie';
import { getEvents, getUserWithToken, setAuthHeader, verifyToken } from 'utils/axios';

import { IUser } from './types';

/**
 * useAuth
 * @category Utils
 * @return {boolean} If user is authenticated
 */

export const useAuth = () => {
  const [hasAuth, setHasAuth] = React.useState(false);
  const [cookies, , removeCookie] = useCookies(['access_token']);
  const [user, setUser] = useSetUser();
  const [events, setEvents] = useEvents();

  React.useEffect(() => {
    setAuthHeader(cookies.access_token || '');
    if (hasAuth) {
      verifyToken().catch(() => {
        removeCookie('access_token');
        setHasAuth(false);
      });
    } else {
      getUserWithToken().then((response: { data: { user: IUser } }) => {
        setUser(response.data);
        setHasAuth(true);
        if (!events || events?.length === 0) {
          getEvents().then((res: { data: Event[] }) => {
            setEvents(res.data);
          });
        }
      });
    }
    // eslint-disable-next-line
  }, [cookies.access_token, user]);
  return hasAuth;
};
