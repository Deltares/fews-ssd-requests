import { Component, Prop, Element } from '@stencil/core'
import {
  FEWS_NAMESPACE,
  addKeyDownListener,
  addLeftClickAction,
  ClickType,
  getUrlForAction,
  SsdWebserviceProvider,
  ActionRequest
} from '@deltares/fews-ssd-requests'

@Component({
  tag: 'schematic-status-display',
  styleUrl: 'schematic-status-display.css',
  shadow: false,
})
export class SchematicStatusDisplay {
  /**
   * The url to fetch the schematic status display svg
   */
  @Prop() src: string;

  /**
   * Transform request function used in the SSD Webservice Provider
   */
  @Prop() transformRequestFn?: (request: Request) => Promise<Request>

  latestRequestReceived: number = new Date().getTime()

  panelId = ''
  ssdProvider!: SsdWebserviceProvider

  @Element() el: HTMLElement;

  // @Event() clickEmitter: EventEmitter<PointerEvent>;

  connectedCallback() {
    if ( this.src === undefined ) return
    const params = new URL(this.src).searchParams
    this.panelId = params.get('ssd')
    const endPoint = this.src.split('ssd')[0]
    this.ssdProvider = new SsdWebserviceProvider(endPoint, {transformRequestFn: this.transformRequestFn})
  }

  componentDidRender() {
    this.loadSvg()
  }

  componentShouldUpdate(value, _old, prop) {
    switch (prop) {
      case 'src':
        const params = new URL(value).searchParams
        this.panelId = params.get('ssd')
        const endPoint = this.src.split('ssd')[0]
        this.ssdProvider = new SsdWebserviceProvider(endPoint, {transformRequestFn: this.transformRequestFn})
        return true
      default:
        return false;
    }
  }

  private getClickRequest(element: SVGElement | HTMLElement, clickType: ClickType): ActionRequest {
    const objectId = element.getAttributeNS(FEWS_NAMESPACE, 'id');
    return {
      panelId: this.panelId,
      objectId,
      clickType,
      config: true
    }
  }

  private async handleAction(request: ActionRequest) {
    const action = await this.ssdProvider.getAction(request);
    const detail = {
      panelId: this.panelId,
      objectId: request.objectId,
      clickType: request.clickType,
      relativeUrl: encodeURI(getUrlForAction(request)),
      results: action.results
    };
    this.el.dispatchEvent(new CustomEvent('action', { detail }));
  }

  async dispatch(event: PointerEvent) {
    let element = event.target as SVGElement | HTMLElement;
    while (!element.getAttributeNS(FEWS_NAMESPACE, 'click')) {
      element = element.parentElement;
    }

    const clickTypes = [ClickType.LEFTSINGLECLICK, ClickType.WEBOCDASHBOARD];
    const requests = clickTypes.map(clickType => this.getClickRequest(element, clickType));
    await Promise.all(requests.map(request => this.handleAction(request)));
  }

  async loadSvg() {
    const target = this.el
    if (this.ssdProvider === undefined) return
    const xmlDoc = await this.ssdProvider.getSvg(this.src)
    if (xmlDoc) {
      target.insertBefore(xmlDoc, target.children[0])
      const svg = target.children[0] as SVGElement
      const initialWidth = svg.getAttribute('width')
      const initialHeight = svg.getAttribute('height')
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      if (!svg.hasAttribute('viewBox')) svg.setAttribute('viewBox', `0 0 ${initialWidth} ${initialHeight}`)

      svg.addEventListener('click', (event) => { if (event.currentTarget === event.target) event.stopPropagation() })
      addLeftClickAction(svg, this.dispatch.bind(this))
      addKeyDownListener(svg, ['Enter'], this.dispatch.bind(this))
      if ( target.children.length > 1) target.removeChild(target.children[1])
      this.el.dispatchEvent(new UIEvent('load'))
    }
  }

}
