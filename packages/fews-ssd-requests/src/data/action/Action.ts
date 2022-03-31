/**
 * Interface for the response of a 'getAction' request
 */
import {Result} from "@/data/action/Result";

export interface Action {
    results: Result[];
}
