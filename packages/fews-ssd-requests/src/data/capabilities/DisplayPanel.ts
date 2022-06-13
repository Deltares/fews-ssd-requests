/**
 * Interface for the 'displayPanel' object in a 'DisplayGroup' object
 */
import {Dimension} from "../../data/capabilities/Dimension.js";

export interface DisplayPanel {
    name: string;
    title: string;
    dimension?: Dimension;
}
