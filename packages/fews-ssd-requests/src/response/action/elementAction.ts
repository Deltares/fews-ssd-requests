/**
 * Interface for the response when retrieving an action for an SVG element
 */
import { Action, ActionWithConfig } from "./action";

export interface ElementAction {
    id: string;
    action: Action;
}

export interface ElementActionWithConfig {
    id: string;
    action: ActionWithConfig;
}
