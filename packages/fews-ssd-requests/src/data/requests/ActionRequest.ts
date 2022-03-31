import {ClickType} from "@/data/ClickType";
import {OptionsType} from "@/data/OptionsType";

export interface ActionRequest {
    baseUrl: string;
    panelId: string;
    objectId: string;
    type: ClickType;
    timeZero?: string;
    options?: OptionsType[];
}
