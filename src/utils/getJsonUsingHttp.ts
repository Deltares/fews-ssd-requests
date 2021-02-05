/**
 * Interface for the response of an http request
 */
export interface HttpResponse<T> extends Response {
  parsedBody?: T;
}

/**
 * Retrieve a JSON object over HTTP, the json is parsed and the result is placed in the
 * 'parsedBody' attribute in the response
 */
export async function getJsonUsingHttp<T> ( path: string, args: RequestInit = { method: 'get' } ): Promise<HttpResponse<T>> {
  const request = new Request(path, args)
  const response: HttpResponse<T> = await fetch(
    request
  )
  response.parsedBody = await response.json()
  return response
}

