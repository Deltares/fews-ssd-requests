import {ClickType} from "@/data/ClickType";
import {OptionsType} from "@/data/OptionsType";

export default interface ActionFromElementRequest {
    panelId: string;
    clickType: ClickType;
    timeZero: string;
    svgElement: SVGElement;
    options: OptionsType[];
}
