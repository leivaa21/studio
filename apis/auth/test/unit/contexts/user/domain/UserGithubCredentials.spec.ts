import { GithubId } from '../../../../../src/contexts/users/domain/GithubId';
import { NumberMother } from '../../../../helpers/object-mother/NumberMother';
import { UserGithubCredentials } from '../../../../../src/contexts/users/domain/UserGithubCredentials';

it('should have type as "GITHUB"', () => {
  const githubId = GithubId.of(NumberMother.random());

  const credentials = UserGithubCredentials.of({ githubId });

  expect(credentials.type).toBe('GITHUB');
});

it('should be possible to verify basic credentials', () => {
  const githubId = GithubId.of(NumberMother.random());

  const credentials = UserGithubCredentials.of({ githubId });

  expect(credentials.doMatch({ githubId })).toBeTruthy();
});

it('should not verify wrong credentials', () => {
  const githubId = GithubId.of(NumberMother.random());

  const credentials = UserGithubCredentials.of({ githubId });

  expect(
    credentials.doMatch({ githubId: GithubId.of(NumberMother.random()) })
  ).toBeFalsy();
});
