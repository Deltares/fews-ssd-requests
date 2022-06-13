/**
 * Interface for the response when retrieving an action for an SVG element
 */
import {Action} from "@/data/action/Action.js";

export interface ElementAction {
    id: string;
    action: Action;
}
