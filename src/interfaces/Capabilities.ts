/**
 * Interface for the response of a 'getCapabilities' request
 */
export interface Capabilities {
  title: string;
  displayGroups: DisplayGroup[];
}

/**
 * Interface for the 'displayGroup' object in a 'Capabilities' object
 */
export interface DisplayGroup {
  name: string;
  title: string;
  displayPanels: DisplayPanel[];
}

/**
 * Interface for the 'displayPanel' object in a 'DisplayGroup' object
 */
export interface DisplayPanel {
  name: string;
  title: string;
  dimension?: Dimension;
}

/**
 * Interface for the 'dimension' object in a 'DisplayPanel' object
 */
export interface Dimension {
  name: string;
  units: Units;
  default: string;
  period: string;
}

/**
 * The possible units in a 'dimension' object
 */
export enum Units {
  Iso8601 = 'ISO8601',
}

