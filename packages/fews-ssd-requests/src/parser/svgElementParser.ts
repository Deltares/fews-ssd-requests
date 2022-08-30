import { ResponseParser } from "./responseParser";

export class SvgElementParser implements ResponseParser<SVGElement> {
    async parse(response: any): Promise<SVGElement> {
        const parser = new DOMParser();
        const text = await response.text()
        const svgDoc = parser.parseFromString(text, "text/xml");
        const element = svgDoc.querySelector<SVGElement>('svg')
        if ( element === null) throw new Error('respsonse does not contain a svg')
        return element
    }
}
