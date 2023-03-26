import { env } from "../../../../lib/env";
import { ApiError } from '@studio/commons/dist/contexts/shared/domain/errors/ApiError';
import { error } from '@studio/api-utils/loggers/console';
type Method = 'POST' | 'GET'

export abstract class ApiService {

  protected readonly jwtSecret = env.jwt.secret;

  constructor(
    protected readonly url: string
  ) {}

  protected formatRequest<Data>(method: Method, data: Data, authorizationToken?: string): RequestInit {
    return {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": authorizationToken || '',
        },
        body: method === 'GET' ? undefined : JSON.stringify(data)
      }
  }
  protected formatUrl(path: string): string {
    return `${this.url}${path}`;
  }
  protected formatPathWithParams(path: string, params: Map<string, string>) {
    const keys = Array.from(params.keys());

    const paramsFormated = keys.map((key, index) => {
      if(index === 0) {
        return `?${key}=${params.get(key)}`
      }
      return `&${key}=${params.get(key)}`
    }).join('')

    return `${path}${paramsFormated}`
  }

  protected async fetch<Response>(path: string, data: RequestInit): Promise<Response> {
    const url = this.formatUrl(path);
    
    try {
      const response = await fetch(url, data);
      const responseJson = await response.json()
      
      if(response.ok) {
        return responseJson;
      }
      
      if(responseJson.apiStatus) {
        // Then is a ApiError
        throw new ApiError(responseJson)
      }
      throw new Error(responseJson.message)

    } catch(SomeError) {
      if( typeof SomeError === 'string') {
        error(SomeError);
      }
      if (typeof SomeError === 'object' && SomeError) {
        error((SomeError as {message: string}).message)
      }

      throw SomeError;
    }
  }


  abstract post<Data, Response>(path: string, data: Data): Promise<Response>

}