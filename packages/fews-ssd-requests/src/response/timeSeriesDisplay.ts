import { Subplot } from './subplot'

export interface TimeSeriesDisplay {
    location:   string;
    locationId: string;
    subplot:    Subplot[];
}
