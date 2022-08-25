/**
 * Interface for the 'displayPanel' object in a 'DisplayGroup' object
 */
import {Dimension} from "@/response/capabilities/dimension";

export interface DisplayPanel {
    name: string;
    title: string;
    dimension?: Dimension;
}
