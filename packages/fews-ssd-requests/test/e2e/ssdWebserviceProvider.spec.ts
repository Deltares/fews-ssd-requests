import { SsdWebserviceProvider } from "../../src/ssdWebserviceProvider";
import { ActionRequest } from "../../src/response/requests/actionRequest";
import 'cross-fetch/polyfill';

const apiEndpoint = "ssd";
const exclude = {
    displayGroups: []
};
const baseUrl = process.env.TEST_URL || "";
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

describe("ssd", function () {
    it("gives the correct url to a panel", function () {
        const provider = new SsdWebserviceProvider(baseUrl);
        const panel = "SomePanelName";
        const today = "2021-01-01T12:34:56Z";
        const url = provider.urlForPanel(panel, new Date(today));
        const expected = baseUrl + apiEndpoint + "?request=GetDisplay&ssd=" + panel + "&time=" + today;
        expect(url).toEqual(expected);
    });

    it("gives the correct url to a panel, with download check", async function () {
        // download a real panel that exists in the capabilities
        const provider = new SsdWebserviceProvider(baseUrl);
        const promise = provider.getCapabilities();
        const capabilities = await promise;
        const group = capabilities.displayGroups[0];
        const panel = group.displayPanels[0];
        const panelName = panel.name;
        let panelDate: string = (new Date()).toISOString();
        if (panel.dimension) {
            const panelPeriod = panel.dimension.period;
            panelDate = panelPeriod.split("/")[0];
        }
        const url = provider.urlForPanel(panelName, new Date(panelDate));
        const svg = provider.getSvg(url);
        expect(svg).toBeDefined();
    });


    it("retrieves capabilities with default excludeGroups argument", async function () {
        const provider = new SsdWebserviceProvider(baseUrl);
        const promise = provider.getCapabilities();
        const capabilities = await promise;
        expect(capabilities).toMatchObject(capabilitiesFormat);

        // check that 'displayName1' and 'displayName1' are in the results
        const names = capabilities.displayGroups.map(x => x.name);
        expect(names).toContain(displayName1);
        expect(names).toContain(displayName2);
    });

    it("retrieves capabilities with empty excludeGroups argument", async function () {
        const provider = new SsdWebserviceProvider(baseUrl);
        const promise = provider.getCapabilities(exclude);
        const capabilities = await promise;
        expect(capabilities).toMatchObject(capabilitiesFormat);

        // check that 'displayName1' and 'displayName1' are in the results
        const names = capabilities.displayGroups.map(x => x.name);
        expect(names).toContain(displayName1);
        expect(names).toContain(displayName2);
    });

    it("retrieves capabilities with exclude groups", async function () {
        const excludeGroup = {
            displayGroups: [
                {name: displayName1},
                {name: displayName2}
            ]
        };
        const provider = new SsdWebserviceProvider(baseUrl);
        const promise = provider.getCapabilities(excludeGroup);
        const capabilities = await promise;
        expect(capabilities).toMatchObject(capabilitiesFormat);

        // check that 'displayName1' and 'displayName1' are NOT in the results
        const names = capabilities.displayGroups.map(x => x.name);
        expect(names).not.toContain(displayName1);
        expect(names).not.toContain(displayName2);
    });

    it("retrieves actions from object id", async function () {
        // download a real action that exists in the capabilities
        // first get the capabilities
        const provider = new SsdWebserviceProvider(baseUrl);
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
        }
        // get the panel SVG
        const url = provider.urlForPanel(panelName, new Date(panelDate));
        expect(url).toContain("https://rwsos-dataservices-ont.avi.deltares.nl/iwp/test/FewsWebServices/ssd?request=GetDisplay&ssd=Overzichtsscherm_WMCN");
        const svg = await provider.getSvg(url);
        expect(svg).toBeDefined();
    });

    it("retrieve svg", async function () {
        const provider = new SsdWebserviceProvider(baseUrl);
        const ssdName = "Meppelerdiep_10min";
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const yesterday = date.toISOString().split("T")[0];
        const url = baseUrl + apiEndpoint + "?request=GetDisplay&ssd=" + ssdName + "&time=" + yesterday + "T00:00:00Z";
        const svg = await provider.getSvg(url);
        expect(svg).toBeDefined();
    })

    it("retrieves actions from svg element", async function () {
        // first get a fresh SVG for midnight yesterday
        const ssdName = "Meppelerdiep_10min";
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const yesterday = date.toISOString().split("T")[0];
        const provider = new SsdWebserviceProvider(baseUrl);
        const requestUrl = baseUrl + apiEndpoint + "?request=GetDisplay&ssd=" + ssdName + "&time=" + yesterday + "T00:00:00Z"
        const svg = await provider.getSvg(requestUrl);
        expect(svg).toBeDefined();
        if (svg !== undefined) {
            const provider = new SsdWebserviceProvider(baseUrl);
            const request: Partial<ActionRequest> = {
                panelId: ssdName,
                clickType: "LEFTSINGLECLICK"
            };
            const elementWithAction = svg.querySelector<SVGElement>('*[fews:id=Windkracht]')
            expect(elementWithAction).not.toBeNull();
            if (elementWithAction !== null) {
                const { id, action } = await provider.getActionFromElement(elementWithAction, request);
                expect(action).toMatchObject(actionFormat);
            }
        }
    });

    it("retrieves timeseries", async function () {
        // download a real timeseries that exists in the capabilities
        // first get the capabilities
        const provider = new SsdWebserviceProvider(baseUrl);
        const capabilities = await provider.getCapabilities();
        // from the capabilities get info for a panel
        const group = capabilities.displayGroups[0];
        const panel = group.displayPanels[0];
        const panelName = panel.name;
        let panelDate: string = (new Date()).toISOString();
        if (panel.dimension) {
            const panelPeriod = panel.dimension.period;
            panelDate = panelPeriod.split("/")[0];
        }
        // get the panel SVG
        const url = provider.urlForPanel(panelName, new Date(panelDate));
        const svgFromUrl = await provider.getSvg(url);
        const actionRequest: ActionRequest = {
            panelId: panelName,
            objectId: 'txt_Windkracht_Stavoren',
            clickType: "LEFTSINGLECLICK"
        };
        const elementAction = await provider.getAction(actionRequest);
        const request2 = elementAction.results[0].requests[0].request;
        const timeSeries = await provider.fetchPiRequest(request2);
        expect(timeSeries).toMatchObject(timeseriesFormat);

    });
});
