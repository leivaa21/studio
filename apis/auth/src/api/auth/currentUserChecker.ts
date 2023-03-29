import { Action } from 'routing-controllers';

export const currentUserChecker = (action: Action) => action.request.user;
