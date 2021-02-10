# fews-ssd-requests

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run Unit tests
```
npm run test
```

### User Guide

This repository provides a single point of access to data for
Schematic Status Display (SSD) applications.

Available interfaces:
* ```WebserviceProvider``` (interface for the provider)
* ```ExcludeGroups``` (interface for defining display groups that are excluded)
* ```Capabilities``` (interface for the objects returned by a 'getCapabilities' SSD request)
* ```Action``` (interface for the objects returned by a 'getAction' SSD request)
* ```Duration``` (interface for defining a duration in years/months/weeks/days/hours/minutes/seconds)
* ```FewsPiTimeSeriesResponse``` (interface for the objects returned by a FEWS PI request)
  - this interface is imported from the fews-pi-requests library

Definition of the provider class:

```
class SsdWebserviceProvider implements WebserviceProvider
  constructor(url: string, excludeGroups: ExcludeGroups)
  getUrl(): string
  getPiUrl(): string
  urlForCapabilities (): string
  urlForPanel (panelName: string, date: Date): string
  urlForActions (panelId: string, objectId: string): string
  getLeftClickAction (panelId: string, objectId: string): Promise<Action>
  fetchPiRequest (request: string): Promise<TimeSeriesResponse>
  getCapabilities (): Promise<Capabilities>
```

Provider methods:
* ```constructor```
  - takes a string url pointing to the base of the provider (i.e. without the 'FewsWebServices/ssd' part)
  - takes an ```ExcludeGroups``` object to define which display groups to exclude
* ```getUrl```
  - returns the base url to the SSD service
* ```getPiUrl```
  - returns the base url to the PI service
* ```urlForCapabilities```
  - returns the url to the SSD capabilities 
* ```urlForPanel```
  - takes a panel name and a date string
  - returns the url to an SSD panel (which points to an SVG image)
* ```urlForActions```
  - takes a panel id and an object id
  - returns the url to the SSD actions associated with that panel/object
* ```getLeftClickAction```
  - takes a panel id and an object id
  - returns the SSD actions associated with that panel/object
* ```fetchPiRequest```
  - takes a request string (i.e. as given in an Action object)
  - returns the PI timeseries
* ```getCapabilities```
  - returns the SSD capabilities

Utility functions:
* ```datesFromPeriod(period: string)```
  - parses a period string (as supplied by a 'getAction' SSD request)
    and returns a list of ```Date``` objects
* ```addLeftClickAction (svg: SVGElement, clickCallback: Function)
  - Add left click action to all SVG elements in the FEWS namespace
