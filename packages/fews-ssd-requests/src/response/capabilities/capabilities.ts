/**
 * Interface for the response of a 'getCapabilities' request
 */
import { DisplayGroup } from "./displayGroup";

export interface Capabilities {
    title: string;
    displayGroups: DisplayGroup[];
}
