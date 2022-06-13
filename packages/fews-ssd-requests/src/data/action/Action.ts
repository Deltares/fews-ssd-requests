/**
 * Interface for the response of a 'getAction' request
 */
import {Result} from "../../data/action/Result.js";

export interface Action {
    results: Result[];
}
