/**
 * Interface for a 'result' object in an 'Action' object
 */
import { ActionType } from "./actionType";
import { ResultRequest } from "./resultRequest";
import { Config } from "../config";

export interface Result {
    type: ActionType;
    requests: ResultRequest[];
    config?: Config;
}

export interface ResultWithConfig extends Result {
    config: Config;
}
