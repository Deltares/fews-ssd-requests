export interface Capabilities {
  title: string;
  displayGroups: DisplayGroup[];
}

export interface DisplayGroup {
  name: string;
  title: string;
  displayPanels: DisplayPanel[];
}

export interface DisplayPanel {
  name: string;
  title: string;
  dimension?: Dimension;
}

export interface Dimension {
  name: string;
  units: Units;
  default: Date;
  period: string;
}

export enum Units {
  Iso8601 = 'ISO8601',
}

