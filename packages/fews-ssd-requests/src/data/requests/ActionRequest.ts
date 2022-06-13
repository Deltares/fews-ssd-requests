import {ClickType} from "../ClickType.js";
import {OptionsType} from "../OptionsType.js";

export interface ActionRequest {
    baseUrl: string;
    panelId: string;
    objectId: string;
    type: ClickType;
    timeZero?: string;
    options?: OptionsType[];
}
