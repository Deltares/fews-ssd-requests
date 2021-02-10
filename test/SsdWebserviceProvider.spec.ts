import {SsdWebserviceProvider} from '../src/SsdWebserviceProvider';
import {FEWS_NAMESPACE} from '../src/utils/addLeftClickAction';

const baseUrl = "https://rwsos.webservices.deltares.nl/iwp/";
const apiEndpoint = "FewsWebServices/ssd";
const piEndpoint = "FewsWebServices";
const exclude = {
  displayGroups: []
};
const displayName1 = "ScadaMeppelerdiep";
const displayName2 = "ScadaNDB";

const dimensionFormat = {
  name: expect.any(String),
  units: expect.any(String),
  default: expect.any(String),
  period: expect.any(String)
};
const displayPanelFormat = {
  name: expect.any(String),
  title: expect.any(String),
  dimension: expect.objectContaining(dimensionFormat)
};
const displayGroupFormat = {
  name: expect.any(String),
  title: expect.any(String),
  displayPanels: expect.arrayContaining([expect.objectContaining(displayPanelFormat)])
};
const capabilitiesFormat = {
  title: expect.any(String),
  displayGroups: expect.arrayContaining([expect.objectContaining(displayGroupFormat)])
};

const actionResultRequestFormat = {
  request: expect.any(String)
};
const actionResultFormat = {
  type: expect.any(String),
  requests: expect.arrayContaining([expect.objectContaining(actionResultRequestFormat)])
};
const actionFormat = {
  results: expect.arrayContaining([expect.objectContaining(actionResultFormat)])
};

const timeseriesFormat = {
  version: expect.any(String),
  timeZone: expect.any(String),
  timeSeries: expect.any(Object)
};

describe("ssd", function() {
  it("creates the SSD api url on creation", function() {
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    expect(provider.getUrl()).toEqual(baseUrl + apiEndpoint);
  });

  it("adds a trailing slash to the supplied url on creation", function() {
    const url = "https://rwsos.webservices.deltares.nl/iwp";
    const provider = new SsdWebserviceProvider(url, exclude);
    expect(provider.getUrl()).toEqual(url + '/' + apiEndpoint);
  });

  it("creates the PI url on creation", function() {
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    expect(provider.getPiUrl()).toEqual(baseUrl + piEndpoint);
  });

  it("gives the correct url to the capabilities", function() {
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    const url = provider.urlForCapabilities();
    const expected = baseUrl + apiEndpoint + "?request=GetCapabilities&format=application/json";
    expect(url).toEqual(expected);
  });

  it("gives the correct url to a panel", function() {
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    const panel = "SomePanelName";
    const today = "2021-01-01T12:34:56Z";
    const url = provider.urlForPanel(panel, new Date(today));
    const expected = baseUrl + apiEndpoint + "?request=GetDisplay&ssd=" + panel + "&time=" + today;
    expect(url).toEqual(expected);
  });

  it("gives the correct url to a panel, with download check", async function() {
    // download a real panel that exists in the capabilities
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    const promise = provider.getCapabilities();
    const capabilities = await promise;
    const group = capabilities.displayGroups[0];
    const panel = group.displayPanels[0];
    const panelName = panel.name;
    let panelDate: string = (new Date()).toISOString();
    if (panel.dimension) {
      const panelPeriod = panel.dimension.period;
      panelDate = panelPeriod.split("/")[0];
    };
    const url = provider.urlForPanel(panelName, new Date(panelDate));
    const request = new Request(url);
    const result = await fetch(request);
    expect(result.status).toEqual(200);
    expect(result.headers.get("content-type")).toMatch("image/svg+xml");
  });

  it("gives the correct url to an action", function() {
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    const panelId = "SomePanelId";
    const objectId = "SomeObjectId";
    const url = provider.urlForActions(panelId, objectId);
    const expected = baseUrl + apiEndpoint + "?request=GetAction&ssd=" + panelId + "&action=leftsingleclick&objectid=" + objectId + "&format=application/json";
    expect(url).toEqual(expected);
  });

  it("retrieves capabilities", async function() {
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    const promise = provider.getCapabilities();
    const capabilities = await promise;
    expect(capabilities).toMatchObject(capabilitiesFormat);

    // check that 'displayName1' and 'displayName1' are in the results
    const names = capabilities.displayGroups.map(x => x.name);
    expect(names).toContain(displayName1);
    expect(names).toContain(displayName2);
  });

  it("retrieves capabilities with exclude groups", async function() {
    const excludeGroup = {
      displayGroups: [
        {name: displayName1},
        {name: displayName2}
        ]
    };
    const provider = new SsdWebserviceProvider(baseUrl, excludeGroup);
    const promise = provider.getCapabilities();
    const capabilities = await promise;
    expect(capabilities).toMatchObject(capabilitiesFormat);

    // check that 'displayName1' and 'displayName1' are NOT in the results
    const names = capabilities.displayGroups.map(x => x.name);
    expect(names).not.toContain(displayName1);
    expect(names).not.toContain(displayName2);
  });

  it("retrieves actions from object id", async function() {
    // download a real action that exists in the capabilities
    // first get the capabilities
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    const promise = provider.getCapabilities();
    const capabilities = await promise;
    // from the capabilities get info for a panel
    const group = capabilities.displayGroups[0];
    const panel = group.displayPanels[0];
    const panelName = panel.name;
    let panelDate: string = (new Date()).toISOString();
    if (panel.dimension) {
      const panelPeriod = panel.dimension.period;
      panelDate = panelPeriod.split("/")[0];
    };
    // get the panel SVG
    const url = provider.urlForPanel(panelName, new Date(panelDate));
    const request = new Request(url);
    const response = await fetch(request);
    const blob = await response.blob();
    const svg = await (new Response(blob)).text();
    // get a valid object id
    const allIds = svg.match(new RegExp('fews:id="(.*?)"', "g"));
    if (allIds) {
      const allObjectNames = allIds.map(x => x.split('"')[1]);
      // get an object with name "Pijl"
      let objectName = "";
      allObjectNames.forEach(name => {
        if (name.includes("Pijl")) {
          objectName = name;
        };
      });
      expect(objectName.length).toBeGreaterThan(0);
      // get the action
      const promise2 = provider.getLeftClickAction(panelName, objectName);
      const action = await promise2;
      expect(action).toMatchObject(actionFormat);
    } else {
      fail("it should not reach here");
    };
  });

  it("retrieves actions from svg element", async function() {
    // first get a fresh SVG for midnight yesterday
    const ssdName = "Meppelerdiep_10min";
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterday = date.toISOString().split("T")[0];
    const url = "https://rwsos.webservices.deltares.nl/iwp/FewsWebServices/ssd?request=GetDisplay&ssd=" + ssdName + "&time=" + yesterday + "T00:00:00Z";

    const request = new XMLHttpRequest();
    request.open('GET', url, false)
    request.send()
    const xmlSvg = request.responseXML;
    let svg: SVGElement;
    if (xmlSvg) {
      svg = xmlSvg.documentElement as unknown as SVGElement;
    } else {
      fail("failed to get svg from:" + url);
    }

    // extract a single svg element in the FEWS namespace
    let element: any = undefined;
    svg.querySelectorAll('*').forEach(function(el: Element) {
      if (el.hasAttributeNS(FEWS_NAMESPACE, 'id')) {
        element = el;
      }
    })
    expect(element).toBeDefined();
    element = element as SVGElement;

    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    const promise = provider.getLeftClickActionFromElement(ssdName, element);
    const action = await promise;
    expect(action).toMatchObject(actionFormat);
  });

  it("retrieves timeseries", async function() {
    // download a real timeseries that exists in the capabilities
    // first get the capabilities
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    const promise = provider.getCapabilities();
    const capabilities = await promise;
    // from the capabilities get info for a panel
    const group = capabilities.displayGroups[0];
    const panel = group.displayPanels[0];
    const panelName = panel.name;
    let panelDate: string = (new Date()).toISOString();
    if (panel.dimension) {
      const panelPeriod = panel.dimension.period;
      panelDate = panelPeriod.split("/")[0];
    };
    // get the panel SVG
    const url = provider.urlForPanel(panelName, new Date(panelDate));
    const request = new Request(url);
    const response = await fetch(request);
    const blob = await response.blob();
    const svg = await (new Response(blob)).text();
    // get a valid object id
    const allIds = svg.match(new RegExp('fews:id="(.*?)"', "g"));
    if (allIds) {
      const allObjectNames = allIds.map(x => x.split('"')[1]);
      // get an object with name "Pijl"
      let objectName = "";
      allObjectNames.forEach(name => {
        if (name.includes("Pijl")) {
          objectName = name;
        };
      });
      expect(objectName.length).toBeGreaterThan(0);
      // get the action
      const promise2 = provider.getLeftClickAction(panelName, objectName);
      const action = await promise2;
      expect(action).toMatchObject(actionFormat);
      // get the request from the action
      const request2 = action.results[0].requests[0].request;
      const promise3 = provider.fetchPiRequest(request2);
      const timeseries = await promise3;
      expect(timeseries).toMatchObject(timeseriesFormat);
    } else {
      fail("it should not reach here");
    };
  });
});

