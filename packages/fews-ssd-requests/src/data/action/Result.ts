/**
 * Interface for a 'result' object in an 'Action' object
 */
import {ActionType} from "../../data/action/ActionType.js";
import {ResultRequest} from "../../data/action/ResultRequest.js";
import {Config} from "../../data/Config.js";

export interface Result {
    type: ActionType;
    requests: ResultRequest[];
    config: Config;
}
