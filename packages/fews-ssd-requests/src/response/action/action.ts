/**
 * Interface for the response of a 'getAction' request
 */
import { Result } from "./result";

export interface Action {
    results: Result[];
}
