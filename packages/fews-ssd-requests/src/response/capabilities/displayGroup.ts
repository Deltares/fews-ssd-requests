/**
 * Interface for the 'displayGroup' object in a 'Capabilities' object
 */
import {DisplayPanel} from "@/response/capabilities/displayPanel";

export interface DisplayGroup {
    name: string;
    title: string;
    displayPanels: DisplayPanel[];
}
