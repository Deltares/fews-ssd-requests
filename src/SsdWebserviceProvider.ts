import { WebserviceProvider, ExcludeGroups, ExcludeGroupsDisplayName } from './interfaces'
import { Action } from './interfaces'
import { Capabilities } from './interfaces'
import { TimeSeriesResponse as FewsPiTimeSeriesResponse} from 'fews-pi-requests'
import { getJsonUsingHttp, HttpResponse } from './utils'
import { FEWS_NAMESPACE } from './utils'

/**
 * The SsdWebserviceProvider class is used to obtain
 * Schematic Status Display (SSD) data and process it
 */
export class SsdWebserviceProvider implements WebserviceProvider{
  ssdUrl: URL
  piUrl: URL
  excludedGroupsNames: string[]
  readonly SSD_ENDPOINT = 'FewsWebServices/ssd'
  readonly PI_ENDPOINT = 'FewsWebServices'

  /**
   * Constructor for SsdWebserviceProvider
   *
   * @param url the base url where the SSD servive is available
   */
  constructor(url: string, excludeGroups: ExcludeGroups) {
    if (!url.endsWith('/')) {
      url += '/'
    }
    this.ssdUrl = new URL(this.SSD_ENDPOINT, url)
    this.piUrl = new URL(this.PI_ENDPOINT, url)
    this.excludedGroupsNames = excludeGroups.displayGroups.map((group: ExcludeGroupsDisplayName) => { return group.name })
  }

  /**
   * Get the base url for SSD requests
   */
  getUrl(): string {
    return this.ssdUrl.toString()
  }

  /**
   * Get the base url for PI requests
   */
  getPiUrl(): string {
    return this.piUrl.toString()
  }

  /**
   * Get the url to retrieve SSD capabilities
   */
  urlForCapabilities (): string {
    const request = '?request=GetCapabilities&format=application/json'
    return encodeURI(this.getUrl() + request)
  }

  /**
   * Get the url to retrieve an SSD panel
   */
  urlForPanel (panelName: string, date: Date): string {
    const dateString = date.toISOString().split('.')[0] + 'Z'
    const request = '?request=GetDisplay&ssd=' + panelName + '&time=' + dateString
    return encodeURI(this.getUrl() + request)
  }

  /**
   * Get the url to retrieve a SSD actions for a specific object on a specific panel
   */
  urlForActions (panelId: string, objectId: string): string {
    // SSD (required): the name of the SSD "DisplayPanel" to query. Only one SSD can be queried at a time.
    // OBJECTID: the id of the SVG object to retrieve the configured actions for.
    // ACTION: the type of user interaction, can be either LEFTSINGLECLICK or LEFTDOUBLECLICK (case insensitive)
    // FORMAT (optional) : the requested output format. ( 'application/xml' or 'application/json')  The default format is XML.
    const request = '?request=GetAction' + '&ssd=' + panelId + '&action=leftsingleclick' + '&objectid=' + objectId + '&format=application/json'
    return encodeURI(this.getUrl() + request)
  }

  /**
   * Retrieve the SSD actions for a specific object id on a specific panel
   */
  getLeftClickAction (panelId: string, objectId: string): Promise<Action> {
    return new Promise<Action>((resolve) => {
      getJsonUsingHttp<Action>(this.urlForActions(panelId, objectId))
        .then((response: HttpResponse<Action>) => {
          resolve(response.parsedBody)
        })
    })
  }

  /**
   * Retrieve the SSD actions for a specific SVG element on a specific panel
   * Raises an error if the element is not part of the FEWS namespace
   */
  getLeftClickActionFromElement (panelId: string, svg: SVGElement): Promise<Action> {
    const objectId = svg.getAttributeNS(FEWS_NAMESPACE, "id")
    if (objectId == null) {
      throw new Error("SVG element is not part of the FEWS namespace")
    }
    return this.getLeftClickAction(panelId, objectId as string)
  }

  /**
   * Retrieve a PI timeseries using the request path supplied in a action
   */
  fetchPiRequest (request: string): Promise<FewsPiTimeSeriesResponse> {
    return new Promise<FewsPiTimeSeriesResponse>((resolve) => {
      getJsonUsingHttp<FewsPiTimeSeriesResponse>(this.getPiUrl() + '/' + request)
        .then((response: HttpResponse<FewsPiTimeSeriesResponse>) => {
          resolve(response.parsedBody)
        })
    })
  }

  /**
   * Retrieve the SSD capabilities
   */
  getCapabilities (): Promise<Capabilities> {
    return new Promise<Capabilities>((resolve) => {
      getJsonUsingHttp<Capabilities>(this.urlForCapabilities())
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
