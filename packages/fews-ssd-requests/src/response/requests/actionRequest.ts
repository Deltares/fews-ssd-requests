import { ClickType } from "../clickType.js";
import { OptionsType } from "../optionsType.js";

export interface ActionRequest {
    panelId: string;
    objectId?: string;
    clickType: ClickType;
    timeZero?: string;
    options?: OptionsType[];
    config?: boolean
}
