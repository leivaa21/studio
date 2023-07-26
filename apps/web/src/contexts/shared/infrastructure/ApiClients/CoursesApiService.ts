import { ApiService } from './ApiService';
import { env } from '../../../../lib/env';

export class CoursesApiService extends ApiService {
  constructor() {
    super(env.courses.url);
  }

  async post<Data, Response>(
    path: string,
    data: Data,
    authorizationToken?: string
  ): Promise<Response> {
    const request = this.formatRequest<Data>('POST', data, authorizationToken);
    return this.fetch<Response>(path, request);
  }

  async put<Data, Response>(
    path: string,
    data: Data,
    authorizationToken?: string
  ): Promise<Response> {
    const request = this.formatRequest<Data>('PUT', data, authorizationToken);
    return this.fetch<Response>(path, request);
  }

  async delete<Data, Response>(
    path: string,
    data: Data,
    authorizationToken?: string
  ): Promise<Response> {
    const request = this.formatRequest<Data>(
      'DELETE',
      data,
      authorizationToken
    );
    return this.fetch<Response>(path, request);
  }

  async get<Response>(
    path: string,
    params: Map<string, string> = new Map<string, string>(),
    authorizationToken?: string
  ): Promise<Response> {
    const request = this.formatRequest<undefined>(
      'GET',
      undefined,
      authorizationToken
    );

    return this.fetch<Response>(
      this.formatPathWithParams(path, params),
      request
    );
  }
}
