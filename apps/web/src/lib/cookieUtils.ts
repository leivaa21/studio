import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export function getAuthTokenCookie() {
  return getCookie('user-token')?.toString();
}
export function setAuthTokenCookie(token: string) {
  setCookie('user-token', token);
}

export function clearAuthTokenCookie() {
  deleteCookie('user-token');
}