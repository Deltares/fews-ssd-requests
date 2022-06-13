import {JsonParser} from "./JsonParser.js";
import {FEWS_NAMESPACE} from "../data/FEWS_NAME_SPACE.js";

export class SvgElementParser implements JsonParser<SVGElement> {
    async parse(response: any): Promise<SVGElement> {
        const parser = new DOMParser;
        const svgString = await response.text()
        const document = parser.parseFromString(svgString, "text/xml");
        let element: SVGElement | undefined = undefined;
        document.querySelectorAll('*').forEach(function (el: Element) {
            if (el.hasAttributeNS(FEWS_NAMESPACE, 'id')) {
                element = el as SVGElement;
            }
        })
        if (element !== undefined) return Promise.resolve(element);
        else return Promise.reject(new Error('svg is not supported'))
    }
}
