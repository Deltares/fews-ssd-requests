import {ClickType} from "../../data//ClickType.js";
import {OptionsType} from "../../data/OptionsType.js";

export interface ActionRequest {
    baseUrl: string;
    panelId: string;
    objectId: string;
    type: ClickType;
    timeZero?: string;
    options?: OptionsType[];
}
