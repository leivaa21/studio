import { Injectable } from '@studio/dependency-injection';
import {
  BadRequestError,
  Get,
  HttpCode,
  JsonController,
  QueryParam,
} from 'routing-controllers';
import { env } from '../../config/env';
import { StatusCode, error } from '@studio/api-utils';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { signJwt } from '../../auth/signJwt';
import { User } from '../../../contexts/users/domain/User';
import { SignInWithGithubCredentialsQuery } from '../../../contexts/users/application/queries/SignIn/SignInWithGithubCredentials';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/auth/github')
export class GithubOauthController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/')
  @HttpCode(StatusCode.OK)
  async Authenticate(@QueryParam('code') code: string) {
    if (!code) {
      throw new BadRequestError('');
    }

    const { access_token } = await this.checkToken({ code });

    const data = await this.getUser({ access_token });
    if (!data.name || !data.id) {
      throw new Error('');
    }

    const user = await this.queryBus.dispatch<
      SignInWithGithubCredentialsQuery,
      User
    >(
      new SignInWithGithubCredentialsQuery({
        githubId: data.id,
        name: data.name,
      })
    );

    const token = signJwt({ id: user.id.value, nickname: user.nickname.value });

    return {
      user: { id: data.id, nickname: data.name },
      token: token,
    };
  }

  private async checkToken({
    code,
  }: {
    code: string;
  }): Promise<{ access_token: string }> {
    const url = `https://github.com/login/oauth/access_token`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.github.id,
          client_secret: env.github.secret,
          code,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      error(JSON.stringify({ ...data, status: response.status }));
    } catch (err) {
      console.error(err);
      error('Failed to fetch Github Oauth Tokens!');
    }
    throw new Error();
  }

  private async getUser({
    access_token,
  }: {
    access_token: string;
  }): Promise<{ id: number; name: string }> {
    const url = `https://api.github.com/user`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      }
      error(JSON.stringify({ ...data, status: response.status }));
    } catch (err) {
      error('Failed to fetch Github Oauth Tokens!');
    }
    throw new Error();
  }

  @Get('/url')
  async getGithubUrl() {
    return { url: this.formatGithubUrl() };
  }

  private formatGithubUrl() {
    const rootUrl = `https://github.com/login/oauth/authorize`;

    const options = {
      scope: 'user:email',
      client_id: env.github.id,
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
  }
}
