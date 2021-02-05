export interface Action {
  results: Result[];
}

export interface Result {
  type: ActionType;
  requests: ResultRequest[];
}

export enum ActionType {
  SSD = 'SSD',
  PDF = 'PDF',
  PI = 'PI',
  URL = 'URL',
}

export interface ResultRequest {
  request: string;
}

