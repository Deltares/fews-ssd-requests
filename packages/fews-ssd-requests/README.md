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

### Run End-to-End tests

For e2e tests a docker container with a Delft-FEWS Web Service is required.
Make sure the docker container is running with the correct date and time.

# the docker container can be run with: 

docker run --rm --pull=always -p 8080:8080 -e FAKETIME="2025-03-14 10:00:00" -e JAVA_OPTS="-Xms512m -Xmx4068m -DTEST_PAGE_ENABLED=true"  delftfewsregistry.azurecr.io/deltares/delft-fews-web-oc/202502/web-oc-web-services:latest

```
npm run e2e
```

### User Guide

This repository provides a single point of access to data for
Schematic Status Display (SSD) applications.

Available interfaces:
* ```WebserviceProvider``` (interface for the provider)
* ```ExcludeGroups``` (interface for defining display groups that are excluded)
* ```Capabilities``` (interface for the objects returned by a 'getCapabilities' SSD request)
* ```Action``` (interface for the objects returned by a 'getAction' SSD request)
* ```ElementAction``` (interface for the object returned by 'getLeftClickActionFromElement')
* ```Duration``` (interface for defining a duration in years/months/weeks/days/hours/minutes/seconds)
* ```FewsPiTimeSeriesResponse``` (interface for the objects returned by a FEWS PI request)
  - this interface is imported from the fews-pi-requests library
* ```ClickCallbackFunction``` (interface for the callback function to be called on a left click event)

Definition of the provider class:

```
class SsdWebserviceProvider implements WebserviceProvider
  constructor(url: string)
  getUrl(): string
  getPiUrl(): string
  urlForCapabilities (): string
  urlForPanel (panelName: string, date: Date): string
  urlForActions (panelId: string, objectId: string, action: ActionClickType, timeZero?: string, options?: ActionOptionType[]): string  getLeftClickAction (panelId: string, objectId: string): Promise<Action>
  getLeftClickActionFromElement (panelId: string, svg: SVGElement): Promise<ElementAction>
  fetchPiRequest (request: string): Promise<TimeSeriesResponse>
  getCapabilities (excludeGroups: ExcludeGroups = {displayGroups: []}): Promise<Capabilities>
```

Provider methods:
* ```constructor(url: string, excludeGroups: ExcludeGroups)```
  - takes a string url pointing to the base of the provider (i.e. without the 'ssd' part)
* ```getUrl(): string```
  - returns the base url to the SSD service
* ```getPiUrl(): string```
  - returns the base url to the PI service
* ```urlForCapabilities(): string```
  - returns the url to the SSD capabilities
* ```urlForPanel (panelName: string, date: Date): string```
  - takes a panel name and a date string
  - returns the url to an SSD panel (which points to an SVG image)
* ```urlForActions (panelId: string, objectId: string, action: ActionClickType, timeZero?: string, options?: ActionOptionType[]): string```
  - takes a panel id and an object id, action type and timeZero and options
  - returns the url to the SSD actions associated with that panel/object
* ```getAction (panelId: string, objectId: string, action: ActionClickType ='LEFTSINGLECLICK', timeZero?: string, options?: ActionOptionType[]): Promise<Action>```
  - takes a panel id and an object id, action type and timeZero and options
  - returns the SSD actions associated with that panel/object
* ```getActionFromElement (panelId: string, svg: SVGElement, timeZero?: string, options?: ActionOptionType[]): Promise<ElementAction>```
  - takes a panel id, a SVG element, action type and timeZero and options
  - returns the SSD actions associated with that element
* ```fetchPiRequest (request: string): Promise<FewsPiTimeSeriesResponse>```
  - takes a request string (i.e. as given in an Action object)
  - returns the PI timeseries
* ```getCapabilities (excludeGroups: ExcludeGroups = {displayGroups: []}): Promise<Capabilities>```
  - takes an optional ```ExcludeGroups``` argument to define which display groups to exclude (if ommitted, defaults to using all groups)
  - returns the SSD capabilities

Utility functions:
* ```datesFromPeriod(period: string): Date[]```
  - parses a period string (as supplied by a 'getAction' SSD request)
    and returns a list of ```Date``` objects
* ```addLeftClickAction (svg: SVGElement, clickCallback: ClickCallbackFunction): void```
  - Add left click action to all SVG elements in the FEWS namespace
