import { Subplot } from './subplot'

export interface TimeSeriesDisplay {
    title?: string;
    location?:   string;
    locationId?: string;
    subplot:    Subplot[];
}
