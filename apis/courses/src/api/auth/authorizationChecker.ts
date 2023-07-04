import passport from 'passport';
import { Action } from 'routing-controllers';
import { User } from './user';

export const authorizationChecker = (action: Action) =>
  new Promise<boolean>((resolve, reject) => {
    passport.authenticate('jwt', (err: Error, user: User) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return resolve(false);
      }
      action.request.user = user;
      return resolve(true);
    })(action.request, action.response, action.next);
  });
