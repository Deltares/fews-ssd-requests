/**
 * Interface for the 'displayGroup' object in a 'Capabilities' object
 */
import {DisplayPanel} from "@/data/capabilities/DisplayPanel.js";

export interface DisplayGroup {
    name: string;
    title: string;
    displayPanels: DisplayPanel[];
}
