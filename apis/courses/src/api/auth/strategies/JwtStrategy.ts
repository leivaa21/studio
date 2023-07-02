import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { env } from '../../config/env';
import { AuthUser } from '../authUser';

const opt: StrategyOptions = {
  jwtFromRequest: (req) => req.headers.authorization || null,
  secretOrKey: env.jwt.secret,
};

passport.use(
  new JwtStrategy(opt, async (jwtPayload: AuthUser, cb) => {
    cb(null, jwtPayload);
  })
);
