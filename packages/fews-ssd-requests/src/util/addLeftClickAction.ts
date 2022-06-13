import { FEWS_NAMESPACE } from "../data/FEWS_NAME_SPACE.js"
import { ClickCallbackFunction } from "./ClickCallbackFunction.js"

export function addLeftClickAction(svg: SVGElement, clickCallback: ClickCallbackFunction): void {
    svg.querySelectorAll<SVGElement>('*').forEach(function (el) {
        // clickable elements get a pointer cursor, the others (like text) get the default cursor
        if (el.hasAttributeNS(FEWS_NAMESPACE, 'click')) {
            el.addEventListener('click', clickCallback)
            el.style.cursor = 'pointer'
            el.setAttribute('pointer-events', 'auto')
        } else if (el.style !== undefined) {
            el.style.cursor = 'default'
        }
    })
}