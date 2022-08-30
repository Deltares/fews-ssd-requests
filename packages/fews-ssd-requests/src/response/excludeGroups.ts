/**
 * Definition of the format of the exclude groups parameter
 * using in the constructor of a WebserviceProvider
 */
import { ExcludeGroupsDisplayName } from "./excludeGroupsDisplayName";

export interface ExcludeGroups {
    displayGroups: ExcludeGroupsDisplayName[];
}
