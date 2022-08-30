/**
 * Interface for the 'displayPanel' object in a 'DisplayGroup' object
 */
import { Dimension } from "./dimension";

export interface DisplayPanel {
    name: string;
    title: string;
    dimension?: Dimension;
}
