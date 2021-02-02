export interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

export async function http<T> ( request: RequestInfo ): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(
    request
  )
  response.parsedBody = await response.json()
  return response
}

export async function getHttp<T> ( path: string, args: RequestInit = { method: 'get' } ): Promise<HttpResponse<T>> {
  return http<T>(new Request(path, args))
}

