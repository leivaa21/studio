import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import jwt from 'jsonwebtoken';
import { NextRouter } from 'next/router';

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
  if (!jwt.decode(token)) return;
  setCookie('user-token', token);
}

export function clearAuthTokenCookie() {
  deleteCookie('user-token');
}
