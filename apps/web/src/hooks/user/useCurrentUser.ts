import { useEffect, useState } from 'react';

import { GetUserResponse } from '@studio/commons';

import { getAuthTokenCookie } from '../../lib/cookieUtils';
import { internalApiClient } from '../../lib/InternalApiClient';

export function useCurrentUser() {
  const [user, setUser] = useState<GetUserResponse>();

  useEffect(() => {
    const token = getAuthTokenCookie();
    if (!token) return;
    internalApiClient.getCurrentUser(token).then((user) => {
      setUser(user);
    });
  }, []);

  return user;
}
