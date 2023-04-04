import { error, StatusCode } from '@studio/api-utils';
import { Injectable } from '@studio/dependency-injection';
import { Request, Response } from 'express';
import passport from 'passport';
import {
  BadRequestError,
  Get,
  HttpCode,
  JsonController,
  QueryParam,
} from 'routing-controllers';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { SignInWithGoogleCredentialsQuery } from '../../../contexts/users/application/queries/SignIn/SignInWithGoogleCredentials';
import { User } from '../../../contexts/users/domain/User';
import { signJwt } from '../../auth/signJwt';
import { env } from '../../config/env';

@Injectable({
  dependencies: [InMemoryQueryBus],
})
@JsonController('/auth/google')
export class GoogleOAuthController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/url')
  @HttpCode(200)
  async GetGoogleUrl() {
    return { url: this.getGoogleUrl() };
  }

  private getGoogleUrl() {
    const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

    const options = {
      redirect_uri: `${env.auth.url}/auth/google`,
      client_id: env.google.id,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };

    const qs = new URLSearchParams(options);

    return `${rootUrl}?${qs.toString()}`;
  }

  @Get('/')
  @HttpCode(200)
  async Authenticate(@QueryParam('code') code: string) {
    if (!code) {
      throw new BadRequestError('');
    }
    const { id_token, access_token } = await this.getGoogleOauthToken({ code });

    const data = await this.getGoogleUser(id_token, access_token);

    if (!data.email || !data.id) {
      throw new Error('');
    }

    const user = await this.queryBus.dispatch<
      SignInWithGoogleCredentialsQuery,
      User
    >(
      new SignInWithGoogleCredentialsQuery({
        googleId: data.id,
        email: data.email,
      })
    );

    const token = signJwt({ id: user.id.value, nickname: user.nickname.value });

    return {
      user: { id: user.id.value, nickname: user.nickname.value },
      token: token,
    };
  }

  private async getGoogleOauthToken({
    code,
  }: {
    code: string;
  }): Promise<{ id_token: string; access_token: string }> {
    const rootURl = 'https://oauth2.googleapis.com/token';

    const options = {
      code,
      client_id: env.google.id,
      client_secret: env.google.secret,
      redirect_uri: `${env.auth.url}/auth/google`,
      grant_type: 'authorization_code',
      scopes: [],
    };

    try {
      const response = await fetch(rootURl, {
        method: 'POST',
        body: JSON.stringify(options),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        return data;
      }
      error(JSON.stringify({ ...data, status: response.status }));
    } catch (err) {
      error('Failed to fetch Google Oauth Tokens!');
    }
    throw new Error();
  }

  private async getGoogleUser(id_token: string, access_token: string) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(err);
      return {};
    }
  }
}
