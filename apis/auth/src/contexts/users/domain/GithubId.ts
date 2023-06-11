import { ValueObject } from '@studio/commons';

export class GithubId extends ValueObject<number> {
  static of(value: number): GithubId {
    return new GithubId(value);
  }
}
