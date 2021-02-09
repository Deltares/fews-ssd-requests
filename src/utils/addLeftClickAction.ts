export const FEWS_NAMESPACE = 'http://www.wldelft.nl/fews'

/**
 * Add left click actions for elements in the FEWS namespace in a given SVG image
 * @param svg the SVG element
 * @param clickCallback the function to be called when the element is clicked
 */
export function addLeftClickAction (svg: SVGElement, clickCallback: Function): void {
  svg.querySelectorAll('*').forEach(function(el: Element) {
    if (el.hasAttributeNS(FEWS_NAMESPACE, 'id')) {
      el.addEventListener('click', function () {
        clickCallback()
      })
      el.setAttribute("style", "cursor: pointer")
    } else {
      // clickable elements get a pointer cursor, the others (like text) get the default cursor
      el.setAttribute("style", "cursor: default")
    }
  })
}
