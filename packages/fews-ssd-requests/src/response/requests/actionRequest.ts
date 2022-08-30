import { ClickType } from "../clickType";
import { OptionsType } from "../optionsType";

export interface ActionRequest {
    panelId: string;
    objectId: string;
    clickType: ClickType;
    timeZero?: string;
    options?: OptionsType[];
}
