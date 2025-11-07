import { SsdWebserviceProvider } from "../../src/ssdWebserviceProvider";
import {ActionRequest} from "../../src/response/requests/actionRequest";
import { ClickType } from "../../src/response/clickType";
import 'cross-fetch/polyfill';

const apiEndpoint = "ssd";
const exclude = {
    displayGroups: []
};
const baseUrl = process.env.DOCKER_URL || "";

const displayName1 = "SSD_CoastalFlooding1";
const displayName2 = "SSD_CoastalFlooding2";
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
            if (panelPeriod === undefined) throw Error("invalid period")
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

        // check that 'displayName1' is in the results
        const names = capabilities.displayGroups.map(x => x.name);
        expect(names).toContain(displayName1);

    });

    it("retrieves capabilities with empty excludeGroups argument", async function () {
        const provider = new SsdWebserviceProvider(baseUrl);
        const promise = provider.getCapabilities(exclude);
        const capabilities = await promise;
        expect(capabilities).toMatchObject(capabilitiesFormat);

        // check that 'displayName1' and 'displayName1' are in the results
        const names = capabilities.displayGroups.map(x => x.name);
        expect(names).toContain(displayName1);
    });

    it("retrieves capabilities with exclude groups", async function () {
        const excludeGroup = {
            displayGroups: [
                {name: displayName1}
            ]
        };
        const provider = new SsdWebserviceProvider(baseUrl);
        const promise = provider.getCapabilities(excludeGroup);
        const capabilities = await promise;
        expect(capabilities).toMatchObject(capabilitiesFormat);

        const names = capabilities.displayGroups.map(x => x.name);
        expect(names).not.toContain(displayName1);
        expect(names).toContain(displayName2);
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
            if (panelPeriod === undefined) throw Error("invalid period")
            panelDate = panelPeriod?.split("/")[0];
        }
        const url = provider.urlForPanel(panelName, new Date(panelDate));
        expect(url).toContain("/FewsWebServices/ssd?request=GetDisplay&ssd=coastal_flooding1&time=2025-03-13T12:00:00Z");
        const svg = await provider.getSvg(url);
        expect(svg).toBeDefined();
    });

    it("retrieve svg", async function () {
        const provider = new SsdWebserviceProvider(baseUrl);
        const ssdName = "coastal_flooding1";
        const url = baseUrl + apiEndpoint + "?request=GetDisplay&ssd=" + ssdName + "&time=2025-03-13T13:00:00Z";
        const svg = await provider.getSvg(url);
        expect(svg).toBeDefined();
    })

    it("retrieves actions from svg element", async function () {
        // first get a fresh SVG for midnight yesterday
        const ssdName = "coastal_flooding1";
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const yesterday = date.toISOString().split("T")[0];
        const provider = new SsdWebserviceProvider(baseUrl);
        const requestUrl = baseUrl + apiEndpoint + "?request=GetDisplay&ssd=" + ssdName + "&time=2025-03-13T13:00:00Z";
        const svg = await provider.getSvg(requestUrl);
        expect(svg).toBeDefined();
        if (svg !== undefined) {
            const provider = new SsdWebserviceProvider(baseUrl);
            const request: ActionRequest = {
                panelId: ssdName,
                clickType: ClickType.LEFTSINGLECLICK
            };
            // ButtonToTSD, LinkToUrl, ButtonToDisplayGroup, ButtonToWindMap, ButtonToFloodWarning2
            const elementWithAction = svg.querySelector<SVGElement>('*[fews:id=ButtonToTSD]')
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
            if (panelPeriod === undefined) throw Error("invalid period")
            panelDate = panelPeriod?.split("/")[0];
        }
        // get the panel SVG
        const url = provider.urlForPanel(panelName, new Date(panelDate));
        const svgFromUrl = await provider.getSvg(url);
        const actionRequest: ActionRequest = {
            panelId: panelName,
            objectId: 'ButtonToTSD',
            clickType: "LEFTSINGLECLICK"
        };
        const elementAction = await provider.getAction(actionRequest);
        const request2 = elementAction.results[0].requests?.[0].request;
        if (request2 === undefined) throw Error("no request found")
        const timeSeries = await provider.fetchPiRequest(request2);
        expect(timeSeries).toMatchObject(timeseriesFormat);
    });

    it("retrieves timeseries with useDisplayUnits and convertDatum equal to true", async function () {
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
            if (panelPeriod === undefined) throw Error("invalid period")
            panelDate = panelPeriod?.split("/")[0];
        }
        const convertDatum = true
        const useDisplayUnits = true

        const actionRequest: ActionRequest = {
            panelId: panelName,
            objectId: 'ButtonToTSD',
            clickType: "LEFTSINGLECLICK",
            useDisplayUnits,
            convertDatum,
        };
        const elementAction = await provider.getAction(actionRequest);
        const request2 = elementAction.results[0].requests?.[0].request;
        if (request2 === undefined) throw Error("no request found")
        const requestUrl = new URL(request2, 'http://dum.my');
        expect(requestUrl.searchParams.get('useDisplayUnits')).toMatch(useDisplayUnits.toString());
        expect(requestUrl.searchParams.get('convertDatum')).toMatch(convertDatum.toString());
        const timeSeries = await provider.fetchPiRequest(request2);
        expect(timeSeries).toMatchObject(timeseriesFormat);

    });

    it("retrieves timeseries with useDisplayUnits and convertDatum equal to false", async function () {
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
            if (panelPeriod === undefined) throw Error("invalid period")
            panelDate = panelPeriod?.split("/")[0];
        }
        const convertDatum = false
        const useDisplayUnits = false

        const actionRequest: ActionRequest = {
            panelId: panelName,
            objectId: 'ButtonToTSD',
            clickType: "LEFTSINGLECLICK",
            useDisplayUnits,
            convertDatum,
        };
        const elementAction = await provider.getAction(actionRequest);
        const request2 = elementAction.results[0].requests?.[0].request;
        if (request2 === undefined) throw Error("no request found")
        const requestUrl = new URL(request2, 'http://dum.my');
        expect(requestUrl.searchParams.get('useDisplayUnits')).toMatch(useDisplayUnits.toString());
        expect(requestUrl.searchParams.get('convertDatum')).toMatch(convertDatum.toString());
        const timeSeries = await provider.fetchPiRequest(request2);
        expect(timeSeries).toMatchObject(timeseriesFormat);

    });


});
