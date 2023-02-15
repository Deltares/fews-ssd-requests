/**
 * Interface for the response of a 'getAction' request
 */
import { Result, ResultWithConfig } from "./result";

export interface Action {
    results: Result[];
}

export interface ActionWithConfig {
    results: ResultWithConfig[];
}