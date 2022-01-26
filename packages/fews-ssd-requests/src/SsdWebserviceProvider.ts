import { ExcludeGroups, ExcludeGroupsDisplayName } from './interfaces'
import { Action, ElementAction, OptionsType, ClickType } from './interfaces'
import { Capabilities } from './interfaces'
import { TimeSeriesResponse as FewsPiTimeSeriesResponse} from '@deltares/fews-pi-requests'
import { getJsonUsingHttp, HttpResponse } from './utils'
import { FEWS_NAMESPACE } from './utils'

/**
 * The SsdWebserviceProvider class is used to obtain
 * Schematic Status Display (SSD) data and process it
 */
export class SsdWebserviceProvider {
  ssdUrl: URL
  piUrl: URL
  readonly SSD_ENDPOINT = 'FewsWebServices/ssd'
  readonly PI_ENDPOINT = 'FewsWebServices'

  /**
   * Constructor for SsdWebserviceProvider
   *
   * @param url the base url where the SSD servive is available
   */
  constructor(url: string) {
    if (!url.endsWith('/')) {
      url += '/'
    }
    this.ssdUrl = new URL(this.SSD_ENDPOINT, url)
    this.piUrl = new URL(this.PI_ENDPOINT, url)
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
  urlForActions (panelId: string, objectId: string, type: ClickType, timeZero?: string, options?: OptionsType[]): string {
    // SSD (required): the name of the SSD "DisplayPanel" to query. Only one SSD can be queried at a time.
    // OBJECTID: the id of the SVG object to retrieve the configured actions for.
    // ACTION: the type of user interaction, can be either LEFTSINGLECLICK or LEFTDOUBLECLICK (case insensitive)
    // TIMEZERO : the reference time0 which is used to transform relative times used in the SSD or timeseries display configuration to absolute date/time values (default is current time)
    // FORMAT (optional) : the requested output format. ( 'application/xml' or 'application/json')  The default format is XML.
    // OPTIONS (optional) : one or more specific options that affect the output, separated by commas. Currently supported are CONFIG (providing additional configuration information) and IMPORTFROMEXTERNALDATASOURCE (add support for external data from a configured FEWS Open Archive)  

    let request = `?request=GetAction&ssd=${panelId}&action=${type}&objectid=${objectId}&format=application/json`
    if (timeZero !== undefined) request += `&timezero=${timeZero}`
    if (options !== undefined) request += `&options=${options.join(',')}`
    return encodeURI(this.getUrl() + request)
  }

  /**
   * Retrieve the SSD actions for a specific object id on a specific panel
   */
  getAction (panelId: string, objectId: string, type: ClickType ='LEFTSINGLECLICK', timeZero?: string, options?: OptionsType[]): Promise<Action> {
    return new Promise<Action>((resolve, reject) => {
      getJsonUsingHttp<Action>(this.urlForActions(panelId, objectId, type, timeZero, options))
        .then((response: HttpResponse<Action>) => {
          if ( response.parsedBody !== undefined ) {
            resolve(response.parsedBody)
          } else {
            reject('Response has no body')
          }        })
    })
  }

  /**
   * Retrieve the SSD actions for a specific SVG element on a specific panel
   * Raises an error if the element is not part of the FEWS namespace
   */
  getActionFromElement (panelId: string, svg: SVGElement, type: ClickType ='LEFTSINGLECLICK', timeZero?: string, options?: OptionsType[]): Promise<ElementAction> {
    const objectId = svg.getAttributeNS(FEWS_NAMESPACE, "id")
    if (objectId == null) {
      throw new Error("SVG element is not part of the FEWS namespace")
    }
    const promise = this.getAction(panelId, objectId as string, type, timeZero, options)
    return promise.then((action: Action) => {
      return {id: objectId, action: action}
    })
  }

  /**
   * Retrieve a PI timeseries using the request path supplied in a action
   */
  fetchPiRequest (request: string): Promise<FewsPiTimeSeriesResponse> {
    return new Promise<FewsPiTimeSeriesResponse>((resolve, reject) => {
      getJsonUsingHttp<FewsPiTimeSeriesResponse>(this.getPiUrl() + '/' + request)
        .then((response: HttpResponse<FewsPiTimeSeriesResponse>) => {
          if ( response.parsedBody !== undefined ) {
            resolve(response.parsedBody)
          } else {
            reject('Response has no body')
          }
        })
    })
  }

  /**
   * Retrieve the SSD capabilities
   */
  getCapabilities (excludeGroups: ExcludeGroups = {displayGroups: []}): Promise<Capabilities> {
    const excludedGroupsNames = excludeGroups.displayGroups.map((group: ExcludeGroupsDisplayName) => { return group.name })
    return new Promise<Capabilities>((resolve, reject) => {
      getJsonUsingHttp<Capabilities>(this.urlForCapabilities())
        .then((response: HttpResponse<Capabilities>) => {
          if (response.parsedBody) {
            response.parsedBody.displayGroups = response.parsedBody.displayGroups.filter((group: ExcludeGroupsDisplayName) => {
              const index = excludedGroupsNames.findIndex((name: string) => {
                return name === group.name
              })
              return index === -1
            })
          }
          if ( response.parsedBody !== undefined ) {
            resolve(response.parsedBody)
          } else {
            reject('Response has no body')
          }
        })
    })
  }
}
