import jwt from 'jsonwebtoken';
import { Nickname } from '@studio/commons';
import { UUID } from '../../../src/contexts/shared/domain/valueObjects/UUID';
import { StringMother } from '../object-mother/StringMother';
import { Builder } from './builder';
import { env } from '../../../src/api/config/env';

export class AuthorizationTokenBuilder implements Builder<string> {
  private _userId: string = UUID.random().value;
  private _nickname: string = StringMother.random({
    maxLength: Nickname.MAX_LENGTH,
    minLength: Nickname.MIN_LENGTH,
    withSymbols: ['_', '.'],
  });

  withUserId(userId: string) {
    this._userId = userId;
    return this;
  }

  build(): string {
    return jwt.sign(
      { id: this._userId, nickname: this._nickname },
      env.jwt.secret
    );
  }
}
