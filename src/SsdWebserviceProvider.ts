import { WebserviceProvider, ExcludeGroups, ExcludeGroupsDisplayName } from './interfaces'
import { Action } from './interfaces'
import { Capabilities } from './interfaces'
import { TimeSeriesResponse as FewsPiTimeSeriesResponse} from './interfaces'
import { getHttp, HttpResponse } from './utils'

/**
 * The SsdWebserviceProvider class is used to obtain
 * Schematic Status Display (SSD) data and process it
 */
export class SsdWebserviceProvider implements WebserviceProvider{
  baseUrl: URL
  excludedGroupsNames: string[]
  readonly API_ENDPOINT = 'FewsWebServices/ssd/'

  /**
   * Constructor for SsdWebserviceProvider
   *
   * @param url the base url where the SSD servive is available
   */
  constructor(url: string, excludeGroups: ExcludeGroups) {
    if (!url.endsWith('/')) {
      url += '/'
    }
    this.baseUrl = new URL(this.API_ENDPOINT, url)
    this.excludedGroupsNames = excludeGroups.displayGroups.map((group: ExcludeGroupsDisplayName) => { return group.name })
  }

  getUrl(): string {
    return this.baseUrl.toString()
  }

  urlForCapabilities (): string {
    const request = 'ssd?request=GetCapabilities&format=application/json'
    return encodeURI(this.getUrl() + request)
  }

  urlForPanel (panelName: string, date: Date): string {
    const dateString = date.toISOString().split('.')[0] + 'Z'
    const request = 'ssd?request=GetDisplay&ssd=' + panelName + '&time=' + dateString
    return encodeURI(this.getUrl() + request)
  }

  urlForActions (panelId: string, objecId: string): string {
    // SSD (required): the name of the SSD "DisplayPanel" to query. Only one SSD can be queried at a time.
    // OBJECTID: the id of the SVG object to retrieve the configured actions for.
    // ACTION: the type of user interaction, can be either LEFTSINGLECLICK or LEFTDOUBLECLICK (case insensitive)
    // FORMAT (optional) : the requested output format. ( 'application/xml' or 'application/json')  The default format is XML.
    const request = 'ssd?request=GetAction' + '&ssd=' + panelId + '&action=leftsingleclick' + '&objectid=' + objecId + '&format=application/json'
    return encodeURI(this.getUrl() + request)
  }

  getLeftClickAction (panelId: string, objectId: string): Promise<Action> {
    return new Promise<Action>((resolve) => {
      getHttp<Action>(this.urlForActions(panelId, objectId))
        .then((response: HttpResponse<Action>) => {
          resolve(response.parsedBody)
        })
    })
  }

  fetchPiRequest (request: string): Promise<FewsPiTimeSeriesResponse> {
    return new Promise<FewsPiTimeSeriesResponse>((resolve) => {
      getHttp<FewsPiTimeSeriesResponse>(this.getUrl() + '/' + request)
        .then((response: HttpResponse<FewsPiTimeSeriesResponse>) => {
          resolve(response.parsedBody)
        })
    })
  }

  getCapabilities (): Promise<Capabilities> {
    return new Promise<Capabilities>((resolve) => {
      getHttp<Capabilities>(this.urlForCapabilities())
        .then((response: HttpResponse<Capabilities>) => {
          if (response.parsedBody) {
            response.parsedBody.displayGroups = response.parsedBody.displayGroups.filter((group: ExcludeGroupsDisplayName) => {
              const index = this.excludedGroupsNames.findIndex((name: string) => {
                return name === group.name
              })
              return index === -1
            })
          }
          resolve(response.parsedBody)
        })
    })
  }
}
