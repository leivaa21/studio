import { GetUserResponse } from '@studio/commons';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { internalApiClient } from './InternalApiClient';

export function getAuthTokenCookie() {
  return getCookie('user-token')?.toString();
}
export async function getAuthTokenCookieDecoded(): Promise<GetUserResponse | null> {
  const token = getCookie('user-token')?.toString();

  const user = await internalApiClient.getCurrentUser(token);

  if (!user) return null;

  return user;
}

export function setAuthTokenCookie(token: string) {
  if (!jwt.decode(token)) return;
  setCookie('user-token', token);
}

export function clearAuthTokenCookie() {
  deleteCookie('user-token');
}
