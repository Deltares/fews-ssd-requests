import { FEWS_NAMESPACE } from "../response/FEWS_NAME_SPACE"
import type { ClickCallbackFunction } from "./clickCallbackFunction"

export function addLeftClickAction(svg: SVGElement, clickCallback: ClickCallbackFunction): void {
    svg.querySelectorAll<SVGElement>('*').forEach(function (el) {
        // clickable elements get a pointer cursor, the others (like text) get the default cursor
        if (el.hasAttributeNS(FEWS_NAMESPACE, 'click')) {
            el.addEventListener('click', clickCallback)
            el.style.cursor = 'pointer'
            if (el.tagName === 'g') {
                el.setAttribute('pointer-events', 'bounding-box')
            } else {
                el.setAttribute('pointer-events', 'auto')
            }
        } else {
            el.setAttribute('pointer-events', 'none')
        }
    })
}