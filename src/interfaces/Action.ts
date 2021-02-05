/**
 * Interface for the response of a 'getAction' request
 */
export interface Action {
  results: Result[];
}

/**
 * Interface for a 'result' object in an 'Action' object
 */
export interface Result {
  type: ActionType;
  requests: ResultRequest[];
}

/**
 * Definition of the possible ActionTypes
 */
export enum ActionType {
  SSD = 'SSD',
  PDF = 'PDF',
  PI = 'PI',
  URL = 'URL',
}

/**
 * Interface for a 'request' object in a 'Result' object
 */
export interface ResultRequest {
  request: string;
}

