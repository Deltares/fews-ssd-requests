/**
 * Interface for the 'dimension' object in a 'DisplayPanel' object
 */
import { Units } from "./units";

export interface Dimension {
    name: string;
    units: Units;
    default: string;
    period: string;
}
