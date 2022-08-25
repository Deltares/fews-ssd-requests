/**
 * Interface for the response of a 'getCapabilities' request
 */
import {DisplayGroup} from "@/response/capabilities/displayGroup";

export interface Capabilities {
    title: string;
    displayGroups: DisplayGroup[];
}
