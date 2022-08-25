import {ClickType} from "@/response/clickType";
import {OptionsType} from "@/response/optionsType";

export interface ActionRequest {
    panelId: string;
    objectId: string;
    clickType: ClickType;
    timeZero?: string;
    options?: OptionsType[];
}
