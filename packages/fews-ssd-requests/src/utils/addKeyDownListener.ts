import { FEWS_NAMESPACE } from "../response/FEWS_NAME_SPACE"
import type { ClickCallbackFunction } from "./clickCallbackFunction"

export function addKeyDownListener(svg: SVGElement, keys: string[], clickCallback: ClickCallbackFunction): void {
    svg.querySelectorAll<SVGElement>('*').forEach(function (el) {
        // clickable elements get a pointer cursor, the others (like text) get the default cursor
        if (el.hasAttributeNS(FEWS_NAMESPACE, 'click') && el.hasAttribute('tabindex')) {
            el.addEventListener('keydown', (event) => {
                if (keys.includes(event.key)) clickCallback(event)
            })
        }
    })
}