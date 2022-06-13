/**
 * Definition of the format of the exclude groups parameter
 * using in the constructor of a WebserviceProvider
 */
import {ExcludeGroupsDisplayName} from "../data/ExcludeGroupsDisplayName.js";

export interface ExcludeGroups {
    displayGroups: ExcludeGroupsDisplayName[];
}
