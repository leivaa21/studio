import { Injectable } from '@studio/dependency-injection';
import { Get, JsonController } from 'routing-controllers';
import { env } from '../../config/env';

@Injectable()
@JsonController('/auth/github')
export class GithubOauthController {
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
