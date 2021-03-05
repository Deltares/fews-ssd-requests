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

