import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { env } from '../../config/env';

const opt: StrategyOptions = {
  jwtFromRequest: (req) => req.headers.authorization || null,
  secretOrKey: env.jwt.secret,
};

passport.use(
  new JwtStrategy(
    opt,
    async (jwtPayload: { id: string; nickname: string }, cb) => {
      cb(null, { id: jwtPayload.id });
    }
  )
);
