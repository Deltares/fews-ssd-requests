export const FEWS_NAMESPACE = 'http://www.wldelft.nl/fews'

export interface ClickCallbackFunction {
  (event: Event): void;
}

/**
 * Add left click actions for elements in the FEWS namespace in a given SVG image
 * @param svg the SVG element
 * @param clickCallback the function to be called when the element is clicked
 */
export function addClickAction(svg: SVGElement, callback: ClickCallbackFunction): void {
  svg.querySelectorAll<SVGElement>('*').forEach(function (el: SVGElement) {
    const style = el.getAttribute('style') || ""
    if (el.hasAttributeNS(FEWS_NAMESPACE, 'click')) {
      el.setAttribute('style', 'cursor: pointer;' + style)
      el.setAttribute('pointer-events', 'auto')
      el.addEventListener('click', callback)
    } else {
      el.style.cursor = 'default'
    }
  })
}
