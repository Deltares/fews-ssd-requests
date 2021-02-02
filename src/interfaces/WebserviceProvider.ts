/**
 * Define an interface for the webservice provider
 */
export interface WebserviceProvider {
  getUrl (): string;
  urlForCapabilities (): string;
  urlForPanel (panelName: string, date: Date): string;
  urlForActions (panelId: string, objecId: string): string;
}

export interface ExcludeGroups {
  displayGroups: ExcludeGroupsDisplayName[];
}

export interface ExcludeGroupsDisplayName {
  name: string;
}

