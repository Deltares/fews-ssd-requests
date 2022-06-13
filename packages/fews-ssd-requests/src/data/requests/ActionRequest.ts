import {ClickType} from "../ClickType.js";
import {OptionsType} from "../OptionsType.js";

export interface ActionRequest {
    panelId: string;
    objectId: string;
    clickType: ClickType;
    timeZero?: string;
    options?: OptionsType[];
}
