import { Chart } from './chart'

export interface Subplot {
    subPlotType: string;
    axisLabel:   string;
    items:       Chart[];
}
