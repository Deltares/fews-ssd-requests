import { Chart } from './chart.js'

export interface Subplot {
    subPlotType?: string;
    axisLabel?:   string;
    items:       Chart[];
}
