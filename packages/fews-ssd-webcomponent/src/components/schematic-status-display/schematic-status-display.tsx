import { Component, Prop, Element } from '@stencil/core'
import { FEWS_NAMESPACE, addClickAction, SsdWebserviceProvider } from '@deltares/fews-ssd-requests/dist/lib'

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
  ssdProvider!: SsdWebserviceProvider

  @Element() el: HTMLElement;

  // @Event() clickEmitter: EventEmitter<PointerEvent>;

  connectedCallback() {
    const params = new URL(this.src).searchParams
    this.panelId = params.get('ssd')
    const endPoint = this.src.split('FewsWebServices/ssd')[0]
    this.ssdProvider = new SsdWebserviceProvider(endPoint)
  }

  disconnectedCallback() {
    console.log('disconnected')
  }

  componentDidRender() {
    this.loadSvg()
  }

  componentShouldUpdate(value, _old, prop) {
    switch (prop) {
      case 'src':
        const params = new URL(value).searchParams
        this.panelId = params.get('ssd')
        const endPoint = this.src.split('FewsWebServices/ssd')[0]
        this.ssdProvider = new SsdWebserviceProvider(endPoint)
        return true
      default:
        return false;
    }
  }

  async dispatch(event: PointerEvent) {
    let element = event.target as SVGElement
    const objectId = element.getAttributeNS(FEWS_NAMESPACE, 'id')
    const action = await this.ssdProvider.getAction(this.panelId, objectId)
    this.el.dispatchEvent(new CustomEvent('action', {
      detail: action.results}))
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
          svg.addEventListener('click', (event) => { if (event.currentTarget === event.target) event.stopPropagation() })
          addClickAction(svg, this.dispatch.bind(this))
          if ( target.children.length > 1) target.removeChild(target.children[1])
          this.el.dispatchEvent(new UIEvent('load'))
        }
      }
    }
  }

}
