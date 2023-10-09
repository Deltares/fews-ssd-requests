import {YAxis} from "./yAxis.js";

export interface Chart {
    type:           string;
    axisLabel:      string;
    lineStyle:      string;
    lineWidth:      number;
    precision:      number;
    preferredColor: string;
    scaleUnit:      number;
    request:        string;
    markerStyle?:   string;
    markerSize?:    number;
    legend: string;
    color: string;
    locationId: string;
    yAxis: YAxis;
}
