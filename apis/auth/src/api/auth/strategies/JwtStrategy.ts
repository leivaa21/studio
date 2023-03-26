import { DependencyContainer } from '@studio/dependency-injection';
import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { GetUserByIdQuery } from '../../../contexts/users/application/queries/GetUser/GetUserById';
import { User } from '../../../contexts/users/domain/User';
import { env } from '../../config/env';

const opt: StrategyOptions = {
  jwtFromRequest: (req) => req.headers.authorization || null,
  secretOrKey: env.jwt.secret,
};

passport.use(
  new JwtStrategy(opt, async (jwtPayload, cb) => {
    const queryBus = DependencyContainer.get<QueryBus>(InMemoryQueryBus);

    const user = await queryBus.dispatch<GetUserByIdQuery, User>(
      new GetUserByIdQuery({ id: jwtPayload.id })
    );

    cb(null, { id: user.id.value, nickname: user.nickname.value });
  })
);
