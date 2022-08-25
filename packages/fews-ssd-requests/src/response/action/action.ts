/**
 * Interface for the response of a 'getAction' request
 */
import {Result} from "@/response/action/result";

export interface Action {
    results: Result[];
}
