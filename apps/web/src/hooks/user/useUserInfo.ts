import { useEffect, useState } from 'react';

import { GetUserInfoResponse } from '@studio/commons';

import { getUserInfoById } from '../../contexts/users/application/getUserInfoById';

export function useUserInfo(userId?: string) {
  const [userInfo, setUserInfo] = useState<GetUserInfoResponse>();

  useEffect(() => {
    if (!userId) return;
    getUserInfoById(userId).then((user) => setUserInfo(user));
  }, [userId]);

  return userInfo;
}
