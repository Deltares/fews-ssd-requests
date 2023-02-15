import { ClickType } from "../clickType";
import { OptionsType } from "../optionsType";

interface ActionRequestParameters {
    panelId: string;
    objectId?: string;
    clickType: ClickType;
    timeZero?: string;
    options?: OptionsType[];
    config?: boolean
}

export interface ActionWithConfigRequest extends ActionRequestParameters{
    config: true
}

export interface ActionWithoutConfigRequest extends ActionRequestParameters{
    config?: false
}

export type ActionRequest = ActionWithConfigRequest | ActionWithoutConfigRequest