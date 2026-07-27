/* tslint:disable */

export interface SsdGetCapabilitiesResponse {
  title: string;
  displayGroups: SsdDisplayGroup[];
}
export interface SsdDisplayGroup {
  name: string;
  title: string;
  timeSliderActive?: boolean;
  displayPanels: SsdDisplayPanel[];
}
export interface SsdDisplayPanel {
  name: string;
  title: string | null;
  dimension?: SsdDisplayPanelDimension;
}
export interface SsdDisplayPanelDimension {
  name: string;
  units: string;
  default: string;
  /**
   * Either a period or times is given. Period is compliant with GC WMS specification (version >= 1.10, appendix B.3 Period format)
   */
  period?: string;
  /**
   * Either a period or times is given. Times are in the ISO_8601 dateformat: yyyy-MM-ddTHH:mm:ssZ
   */
  times?: string[];
}
