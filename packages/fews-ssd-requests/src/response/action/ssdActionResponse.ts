/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * SsdActionsResponse PI_JSON
 */
export interface SsdActionsResponse {
  resultsNotAvailableForRequest?: boolean;
  /**
   * SsdActionsResults
   */
  results: SsdActionResult[];
}
export interface SsdActionResult {
  type: "PI" | "SSD" | "PDF" | "URL" | "WMS";
  title?: string;
  /**
   * SsdActionRequests
   */
  requests: SsdActionRequest[];
  config?: ActionRequestConfig;
}
export interface SsdActionRequest {
  key?: string;
  request: string;
}
export interface ActionRequestConfig {
  timeSeriesDisplay: TimeSeriesDisplayConfig;
}
export interface TimeSeriesDisplayConfig {
  /**
   * Error in case a not supported configuration is used.
   */
  error?: string;
  title?: string;
  forecastLegend?: string;
  subplots?: TimeSeriesDisplaySubplot[];
}
export interface TimeSeriesDisplaySubplot {
  items: TimeSeriesDisplaySubplotItem[];
}
export interface TimeSeriesDisplaySubplotItem {
  type: string;
  legend?: string;
  color?: string;
  lineStyle?: string;
  lineWidth?: number;
  opaquenessPercentage?: number;
  markerStyle?: string;
  markerSize?: number;
  locationId?: string;
  yAxis?: TimeSeriesDisplaySubplotItemAxis;
  thresholds?: TimeSeriesDisplaySubplotItemThreshold;
  /**
   * Key of the request. Only used if there is only one request.
   */
  request?: string;
  /**
   * Array with the keys of the requests. Only used if there are multiple requests.
   */
  requests?: string[];
}
export interface TimeSeriesDisplaySubplotItemAxis {
  axisPosition?: string;
  axisLabel?: string;
  axisMinValue?: number;
  axisMaxValue?: number;
}
export interface TimeSeriesDisplaySubplotItemThreshold {
  value?: number;
  label?: string;
  color?: string;
}
