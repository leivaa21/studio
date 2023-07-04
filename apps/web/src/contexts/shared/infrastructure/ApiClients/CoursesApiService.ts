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
}