/**
 * Interface for the 'displayGroup' object in a 'Capabilities' object
 */
import { DisplayPanel } from "./displayPanel";

export interface DisplayGroup {
    name: string;
    title: string;
    displayPanels: DisplayPanel[];
}
