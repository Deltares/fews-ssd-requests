/**
 * Interface for the response when retrieving an action for an SVG element
 */
import { SsdActionsResponse } from "./ssdActionResponse.js";

export interface ElementAction {
    id: string;
    action: SsdActionsResponse;
}
