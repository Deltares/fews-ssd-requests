import JsonParser from "../parser/JsonParser";

export default class SvgElementParser implements JsonParser<SVGElement> {
    parse(response: any): SVGElement {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(response, "text/xml");
        const element = svgDoc.querySelector<SVGElement>('svg')
        if ( element === null) throw new Error('respsonse does not contain a svg')
        return element
    }
}
