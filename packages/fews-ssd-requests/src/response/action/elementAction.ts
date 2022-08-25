/**
 * Interface for the response when retrieving an action for an SVG element
 */
import {Action} from "@/response/action/action";

export interface ElementAction {
    id: string;
    action: Action;
}
