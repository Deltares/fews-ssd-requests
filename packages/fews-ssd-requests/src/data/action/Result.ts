/**
 * Interface for a 'result' object in an 'Action' object
 */
import {ActionType} from "@/data/action/ActionType";
import {ResultRequest} from "@/data/action/ResultRequest";
import {Config} from "@/data/Config";

export interface Result {
    type: ActionType;
    requests: ResultRequest[];
    config: Config;
}
