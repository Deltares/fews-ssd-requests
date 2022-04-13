import {ClickType} from "@/data/ClickType";
import {OptionsType} from "@/data/OptionsType";

export interface ActionRequest {
    panelId: string;
    objectId: string;
    clickType: ClickType;
    timeZero?: string;
    options?: OptionsType[];
}
