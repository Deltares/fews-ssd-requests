import {ClickCallbackFunction} from "./ClickCallbackFunction.js";
import {FEWS_NAMESPACE} from "../data/FEWS_NAME_SPACE.js";

export function addLeftClickAction(svg: SVGElement, clickCallback: ClickCallbackFunction): void {
    svg.querySelectorAll('*').forEach(function (el: Element) {
        const style = el.getAttribute('style') || ""
        if (el.hasAttributeNS(FEWS_NAMESPACE, 'click')) {
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