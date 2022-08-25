/**
 * Interface for a 'result' object in an 'Action' object
 */
import {ActionType} from "@/response/action/actionType";
import {ResultRequest} from "@/response/action/resultRequest";
import {Config} from "@/response/config";

export interface Result {
    type: ActionType;
    requests: ResultRequest[];
    config: Config;
}
