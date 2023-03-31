import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';

export function getAuthTokenCookie() {
  return getCookie('user-token')?.toString();
}
export function getAuthTokenCookieDecoded(): {
  nickname: string;
  id: string;
} | null {
  const token = getCookie('user-token')?.toString();
  return jwt.decode(token || '', { json: true }) as {
    nickname: string;
    id: string;
  } | null;
}

export function setAuthTokenCookie(token: string) {
  setCookie('user-token', token);
}

export function clearAuthTokenCookie() {
  deleteCookie('user-token');
}
