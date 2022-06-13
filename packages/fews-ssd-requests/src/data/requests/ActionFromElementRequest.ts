import {ClickType} from "../ClickType.js";
import {OptionsType} from "../OptionsType.js";

export interface ActionFromElementRequest {
    panelId: string;
    clickType: ClickType;
    timeZero?: string;
    svgElement: SVGElement;
    options?: OptionsType[];
}
