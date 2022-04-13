import { Chart } from './Chart'

export interface Subplot {
    subPlotType: string;
    axisLabel:   string;
    items:       Chart[];
}
