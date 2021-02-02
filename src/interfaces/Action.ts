export interface Action {
  results: Result[]
}

export interface Result {
  type: ActionType;
  requests: IRequest[];
}

export enum ActionType {
  SSD = 'SSD',
  PDF = 'PDF',
  PI = 'PI',
  URL = 'URL',
}

export interface IRequest {
  request: string;
}

