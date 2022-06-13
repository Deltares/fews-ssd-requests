import { Chart } from './Chart.js'

export interface Subplot {
    subPlotType: string;
    axisLabel:   string;
    items:       Chart[];
}
