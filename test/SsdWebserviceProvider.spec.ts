import {SsdWebserviceProvider} from '../src/SsdWebserviceProvider';

const baseUrl = "https://rwsos.webservices.deltares.nl/iwp/";
const apiEndpoint = "FewsWebServices/ssd";
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

describe("ssd", function() {
  it("creates the api url on creation", function() {
    const provider = new SsdWebserviceProvider(baseUrl, exclude);
    expect(provider.getUrl()).toEqual(baseUrl + apiEndpoint);
  });

  it("adds a trailing slash to the supplied url on creation", function() {
    const url = "https://rwsos.webservices.deltares.nl/iwp";
    const provider = new SsdWebserviceProvider(url, exclude);
    expect(provider.getUrl()).toEqual(url + '/' + apiEndpoint);
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
});

