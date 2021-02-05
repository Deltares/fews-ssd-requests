// All numbers in the response are quoted, and hence of data type 'string'.

export interface TimeSeriesResponse {
  version? : string;
  timeZone? : string; // Can be a number (offset in hours) or a string with the (daylight savings) time zone (see pi_sharedtypes.xsd)
  timeSeries: TimeSeriesResult[];
}

export interface TimeSeriesResult {
  header: Header;
  properties? : Property[];
  domainAxisValues? : DomainAxisValue[];
  events? : Event[];
  comment? : string;
}

export interface Header {
  type: 'accumulative' | 'instantaneous';
  moduleInstanceId? : string;
  locationId: string;
  parameterId: string;
  domainParameterId? : string[]; // data type?
  qualifierId? : string[];
  ensembleId? : string;
  // Only one of the following two is defined (only) if ensembleId is defined.
  ensembleMemberIndex? : string; // non-negative number
  ensembleMemberId? : string; // string identifier
  timeStep: TimeStep;
  startDate: FewsPiDate; // Date/time of the first event
  endDate: FewsPiDate; // Date/time of the last event
  forecastDate? : FewsPiDate; // Date/time of the forecast
  approvedDate? : FewsPiDate; // Date/time that the forecast was made current
  missVal: string; // number
  longName? : string; // Of what?
  stationName? : string;
  lat? : string; // number
  lon? : string; // number
  x? : string; // number
  y? : string; // number
  z? : string; // number
  units? : string;
  domainAxis? : DomainAxis[];
  sourceOrganisation? : string;
  sourceSystem? : string;
  fileDescription? : string;
  creationDate? : string;
  creationTime? : string;
  region? : string;
  threshold? : Threshold;
  firstValueTime? : FewsPiDate;
  lastValueTime? : FewsPiDate;
  maxValue? : string; // number
  minValue? : string; // number
  valueCount: string; // number
  product? : Product;
}

export interface Event {
  date: string;
  time: string;
  startDate? : string;
  startTime? : string;
  endDate? : string;
  endTime? : string;
  value? : string; // number
  minValue? : string; // number
  maxValue? : string; // number
  flag? : string; // number; related to quality
  flagSource? : string; // Validation rule used to determine the quality flag
  comment? : string;
  user? : string;
};

export interface FewsPiDate {
  date: string;
  time: string;
};

// The following types are not used to convert the data to DD format, and are
// hence left empty.
type Property = object;
type DomainAxisValue = object;
type TimeStep = object;
type DomainAxis = object;
type Product = object;
type Threshold = object;

