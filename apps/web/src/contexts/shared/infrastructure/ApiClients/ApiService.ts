import { env } from "../../../../lib/env";
import { ApiError } from "../../domain/errors/ApiError";

type Method = 'POST' | 'GET'

export abstract class ApiService {

  protected readonly jwtSecret = env.jwt.secret;

  constructor(
    protected readonly url: string
  ) {}

  protected formatRequest<Data>(method: Method, data: Data): RequestInit {
    return {
        method,
        headers: {
          "Content-Type": "application/json",
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
      
      throw new ApiError({
        errorCode: responseJson.errorCode,
        apiStatus: responseJson.status,
        message: responseJson.message
      })

    } catch(error) {

      throw error
    }
  }


  abstract post<Data, Response>(path: string, data: Data): Promise<Response>

}