import { AuthUser } from './authUser';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signJwt(user: AuthUser) {
  return jwt.sign(user, env.jwt.secret);
}
