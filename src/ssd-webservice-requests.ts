/**
 * The SsdWebserviceProvider class is used to obtain
 * Schematic Status Display (SSD) data and process it
 */
export class SsdWebserviceProvider {
  baseUrl: URL
  readonly API_ENDPOINT = 'FewsWebServices/ssd'

  /**
   * Constructor for SsdWebserviceProvider
   *
   * @param url the base url where the SSD servive is available
   */
  constructor(url: string) {
    if (!url.endsWith('/')) {
      url += '/'
    }
    this.baseUrl = new URL('', url)
  }

  getUrl(): any {
    return this.baseUrl.toString()
  }
}

