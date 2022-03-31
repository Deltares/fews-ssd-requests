import JsonParser from "../parser/JsonParser";
import JSDOM from "jsdom";
import {FEWS_NAMESPACE} from "../data/FEWS_NAME_SPACE";

export default class SvgElementParser implements  JsonParser<SVGElement> {
    parse(response: any): SVGElement {
        const dom = new JSDOM.JSDOM("");
        const DOMParser = dom.window.DOMParser;
        const parser = new DOMParser;
        const document = parser.parseFromString(response, "text/xml");
        let element: SVGElement = {} as SVGElement;
        document.querySelectorAll('*').forEach(function (el: Element) {
            if (el.hasAttributeNS(FEWS_NAMESPACE, 'id')) {
                element = el as SVGElement;
            }
        })
        return element;
    }

}
