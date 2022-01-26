import { Subplot } from './Subplot'

export interface TimeSeriesDisplay {
    location:   string;
    locationId: string;
    subplot:    Subplot[];
}
