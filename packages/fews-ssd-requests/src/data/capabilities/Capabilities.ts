/**
 * Interface for the response of a 'getCapabilities' request
 */
import {DisplayGroup} from "@/data/capabilities/DisplayGroup.js";

export interface Capabilities {
    title: string;
    displayGroups: DisplayGroup[];
}
