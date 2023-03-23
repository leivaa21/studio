import { ApiService } from "./ApiService";
import { env } from "../../../../lib/env";

export class AuthApiService extends ApiService {
  constructor() {
    super(env.auth.url);
  }
  
  async post<Data, Response>(path: string, data: Data): Promise<Response> {
    const request = this.formatRequest<Data>('POST', data);
    return this.fetch<Response>(path, request);
  }
  async get<Response>(path: string, params: Map<string, string>): Promise<Response> {
    const request = this.formatRequest<{}>('GET', {});
    return this.fetch<Response>(this.formatPathWithParams(path, params), request);
  }

}
