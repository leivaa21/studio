import passport from 'passport';
import { Action } from 'routing-controllers';
import { AuthUser } from './authUser';
import { UnauthorizedError } from '@studio/api-utils';

export const authorizationChecker = (action: Action) =>
  new Promise<boolean>((resolve, reject) => {
    passport.authenticate('jwt', (err: Error, user: AuthUser) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        return reject(
          new UnauthorizedError(action.request.method, action.request.path)
        );
      }
      action.request.user = user;
      return resolve(true);
    })(action.request, action.response, action.next);
  });
