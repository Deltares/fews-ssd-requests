import { Component, Prop, Element } from '@stencil/core';

const FEWS_NAMESPACE = 'http://www.wldelft.nl/fews'

// type OptionsType = 'config' | 'IMPORTFROMEXTERNALDATASOURCE';
// type ClickType = 'LEFTSINGLECLICK' | 'LEFTDOUBLECLICK';

/**
 * Interface for the response of a 'getAction' request
 */
// interface Action {
//   results: Result[];
// }

/**
 * Interface for a 'result' object in an 'Action' object
 */
// interface Result {
//   type: ActionType;
//   requests: ResultRequest[];
// }

/**
 * Definition of the possible ActionTypes
 */
//  enum ActionType {
//   SSD = 'SSD',
//   PDF = 'PDF',
//   PI = 'PI',
//   URL = 'URL',
// }

/**
 * Interface for a 'request' object in a 'Result' object
 */
// interface ResultRequest {
//   key: string;
//   request: string;
// }

/**
 * Interface for the response when retrieving an action for an SVG element
 */
// interface ElementAction {
//   id: string;
//   action: Action;
// }



/**
 * Interface for the response of an http request
 */
// interface HttpResponse<T> extends Response {
//   parsedBody?: T;
// }

/**
 * Retrieve a JSON object over HTTP, the json is parsed and the result is placed in the
 * 'parsedBody' attribute in the response
 */
// async function getJsonUsingHttp<T> ( path: string, args: RequestInit = { method: 'get' } ): Promise<HttpResponse<T>> {
//   const request = new Request(path, args)
//   const response: HttpResponse<T> = await fetch(
//     request
//   )
//   response.parsedBody = await response.json()
//   return response
// }


/**
 * Get the url to retrieve a SSD actions for a specific object on a specific panel
 */
// function urlForActions (panelId: string, objectId: string, type: ClickType, timeZero?: string, options?: OptionsType[]): string {
//   // SSD (required): the name of the SSD "DisplayPanel" to query. Only one SSD can be queried at a time.
//   // OBJECTID: the id of the SVG object to retrieve the configured actions for.
//   // ACTION: the type of user interaction, can be either LEFTSINGLECLICK or LEFTDOUBLECLICK (case insensitive)
//   // TIMEZERO : the reference time0 which is used to transform relative times used in the SSD or timeseries display configuration to absolute date/time values (default is current time)
//   // FORMAT (optional) : the requested output format. ( 'application/xml' or 'application/json')  The default format is XML.
//   // OPTIONS (optional) : one or more specific options that affect the output, separated by commas. Currently supported are CONFIG (providing additional configuration information) and IMPORTFROMEXTERNALDATASOURCE (add support for external data from a configured FEWS Open Archive)

//   let request = `?request=GetAction&ssd=${panelId}&action=${type}&objectid=${objectId}&format=application/json`
//   if (timeZero !== undefined) request += `&timezero=${timeZero}`
//   if (options !== undefined) request += `&options=${options.join(',')}`
//   return encodeURI(this.getUrl() + request)
// }

/**
 * Add left click actions for elements in the FEWS namespace in a given SVG image
 * @param svg the SVG element
 * @param clickCallback the function to be called when the element is clicked
 */
function addClickAction(svg: SVGElement, callback: any): void {
  svg.addEventListener('click', (event) => { if (event.currentTarget === event.target) event.stopPropagation() })
  svg.querySelectorAll('*').forEach(function (el: Element) {
    const style = el.getAttribute('style') || ""
    if (el.hasAttributeNS(FEWS_NAMESPACE, 'click')) {
      el.setAttribute('style', 'cursor: pointer;' + style)
      el.setAttribute('pointer-events', 'auto')
      el.addEventListener('click', callback)
    } else {
      // clickable elements get a pointer cursor, the others (like text) get the default cursor
      el.setAttribute('style', 'cursor: default;' + style)
      // if (el.tagName !== 'g') el.setAttribute('pointer-events','none')
    }
  })
}

/**
 * Retrieve the SSD actions for a specific object id on a specific panel
 */
// function getAction (panelId: string, objectId: string, type: ClickType ='LEFTSINGLECLICK', timeZero?: string, options?: OptionsType[]): Promise<Action> {
//   return new Promise<Action>((resolve, reject) => {
//     getJsonUsingHttp<Action>(urlForActions(panelId, objectId, type, timeZero, options))
//       .then((response: HttpResponse<Action>) => {
//         if ( response.parsedBody !== undefined ) {
//           resolve(response.parsedBody)
//         } else {
//           reject('Response has no body')
//         }
//       })
//     }
//   )
// }

/**
 * Retrieve the SSD actions for a specific SVG element on a specific panel
 * Raises an error if the element is not part of the FEWS namespace
 */
// function getActionFromElement (panelId: string, svg: SVGElement, type: ClickType ='LEFTSINGLECLICK', timeZero?: string, options?: OptionsType[]): Promise<ElementAction> {
//   const objectId = svg.getAttributeNS(FEWS_NAMESPACE, "id")
//   if (objectId == null) {
//     throw new Error("SVG element is not part of the FEWS namespace")
//   }
//   const promise = getAction(panelId, objectId as string, type, timeZero, options)
//   return promise.then((action: Action) => {
//     return {id: objectId, action: action}
//   })
// }


@Component({
  tag: 'schematic-status-display',
  styleUrl: 'schematic-status-display.css',
  shadow: false,
})
export class SchematicStatusDisplay {
  /**
   * The first name
   */
  @Prop() src: string;

  /**
   * The middle name
   */
  @Prop() width: number;

  /**
   * The last name
   */
  @Prop() height: number;

  latestRequestReceived: number = new Date().getTime()
  panelId = ''

  @Element() el: HTMLElement;

  // @Event() clickEmitter: EventEmitter<PointerEvent>;

  connectedCallback() {
    const params = new URL(this.src).searchParams
    this.panelId = params.get('ssd')
  }

  // disconnectedCallback() {
  //   console.log('disconnected')
  // }

  componentDidRender() {
    this.loadSvg()
  }

  componentShouldUpdate(value, _old, prop) {
    switch (prop) {
      case 'src':
        const params = new URL(value).searchParams
        this.panelId = params.get('ssd')
        return true
      default:
        return false;
    }
  }

  dispatch(event: PointerEvent) {
    let element = event.target as SVGElement
    // const actions = await getActionFromElement(this.panelId, element)
    this.el.dispatchEvent(new CustomEvent('action', {
      detail: 'Action to be fetched for ' + this.panelId + 'object' + element.getAttributeNS(FEWS_NAMESPACE, 'id')
    }))
  }

  loadSvg() {
    const target = this.el
    const request = new XMLHttpRequest() as any
    request.timeStamp = new Date().getTime()
    request.open('GET', this.src, true)
    request.send()
    request.onload = () => {
      if (request.timeStamp > this.latestRequestReceived) {
        this.latestRequestReceived = request.timeStamp
        const xmlDoc = request.responseXML
        if (xmlDoc) {
          target.insertBefore(xmlDoc.documentElement, target.children[0])
          const svg = target.children[0] as SVGElement
          svg.setAttribute('width', '100%')
          svg.setAttribute('height', '100%')
          addClickAction(svg, this.dispatch.bind(this))
          if ( target.children.length > 1) target.removeChild(target.children[1])
          this.el.dispatchEvent(new CustomEvent('load', {
            detail: this.src
          }))
        }
      }
    }
  }

}
