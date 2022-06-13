import { Subplot } from './Subplot.js'

export interface TimeSeriesDisplay {
    location:   string;
    locationId: string;
    subplot:    Subplot[];
}
