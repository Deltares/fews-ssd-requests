/**
 * Define an interface for the webservice provider
 */
export interface WebserviceProvider {
  getUrl (): string;
  urlForCapabilities (): string;
  urlForPanel (panelName: string, date: Date): string;
  urlForActions (panelId: string, objectId: string): string;
}

/**
 * Definition of the format of the exclude groups parameter
 * using in the constructor of a WebserviceProvider
 */
export interface ExcludeGroups {
  displayGroups: ExcludeGroupsDisplayName[];
}

/**
 * Definition of a 'displayGroup' object in an 'ExcludeGroups' object
 */
export interface ExcludeGroupsDisplayName {
  name: string;
}

