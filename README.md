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
* ```TimeSeriesResponse``` (interface for the objects returned by a FEWS PI request)

Definition of the provider class:

'''
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
'''

Utility functions:
* ```datesFromPeriod```
  - parses a period string (as supplied by a 'getAction' SSD request)
    and returns a list of ```Date``` objects
