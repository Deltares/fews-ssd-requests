export const FEWS_NAMESPACE = 'http://www.wldelft.nl/fews'

export interface ClickCallbackFunction {
  (event: Event): void;
}

/**
 * Add left click actions for elements in the FEWS namespace in a given SVG image
 * @param svg the SVG element
 * @param clickCallback the function to be called when the element is clicked
 */
export function addLeftClickAction (svg: SVGElement, clickCallback: ClickCallbackFunction): void {
  svg.querySelectorAll('*').forEach(function(el: Element) {
    const style = el.getAttribute('style') || ""
    if (el.hasAttributeNS(FEWS_NAMESPACE, 'id')) {
      el.addEventListener('click', function (event: Event) {
        clickCallback(event)
      })
      el.setAttribute('style', 'cursor: pointer;' + style)
    } else {
      // clickable elements get a pointer cursor, the others (like text) get the default cursor
      el.setAttribute('style', 'cursor: default;' + style)
    }
  })
}
