import { ApiError } from '@studio/commons';

type Method = 'POST' | 'GET';

class InternalApiService {
  async post<Data, Response>(path: string, data: Data): Promise<Response> {
    const request = this.formatRequest<Data>('POST', data);
    return this.fetch<Response>(path, request);
  }
  async get<Response>(
    path: string,
    params: Map<string, string>,
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

  protected formatRequest<Data>(
    method: Method,
    data: Data,
    authorizationToken?: string
  ): RequestInit {
    return {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorizationToken || '',
      },
      body: method === 'GET' || !data ? undefined : JSON.stringify(data),
    };
  }

  protected formatPathWithParams(path: string, params: Map<string, string>) {
    const keys = Array.from(params.keys());

    const paramsFormated = keys
      .map((key, index) => {
        if (index === 0) {
          return `?${key}=${params.get(key)}`;
        }
        return `&${key}=${params.get(key)}`;
      })
      .join('');

    return `${path}${paramsFormated}`;
  }

  protected async fetch<Response>(
    url: string,
    data: RequestInit
  ): Promise<Response> {
    const response = await fetch(url, data);
    const responseJson = await response.json();

    if (response.ok) {
      return responseJson;
    }

    if (responseJson.apiStatus) {
      // Then is a ApiError
      throw new ApiError(responseJson);
    }

    throw new Error(responseJson.message);
  }
}

const internalApiClient = new InternalApiService();

export { internalApiClient };
