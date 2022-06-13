/**
 * The SsdWebserviceProvider class is used to obtain
 * Schematic Status Display (SSD) data and process it
 */
import {ExcludeGroupsDisplayName} from "./data/ExcludeGroupsDisplayName.js";
import {ExcludeGroups} from "./data/ExcludeGroups.js";
import {Capabilities} from "./data/Capabilities/Capabilities";
import {Action} from "./data/action/Action.js";
import {ActionRequestBuilder} from "./requestbuilder/ActionRequestBuilder.js";
import {ActionRequest} from "./data/requests/ActionRequest.js";
import {PiRestService} from "./restservice/PiRestService.js";
import {RequestOptions} from "./restservice/RequestOptions.js";
import {DefaultParser} from "./parser/DefaultParser.js";
import {ElementAction} from "./data/action/ElementAction.js";
import {FEWS_NAMESPACE} from "./data/FEWS_NAME_SPACE.js";
import {CapabilitiesParsers} from "./parser/CapabilitiesParsers.js";
import {TimeSeriesResponse as FewsPiTimeSeriesResponse} from '@deltares/fews-pi-requests'
import {SvgElementParser} from "./parser/SvgElementParser.js";
import {ActionFromElementRequest} from "./data/requests/ActionFromElementRequest.js";

export class SsdWebserviceProvider {
    private ssdUrl: URL
    private piUrl: URL
    private readonly SSD_ENDPOINT = 'FewsWebServices/ssd'
    private readonly PI_ENDPOINT = 'FewsWebServices'

    /**
     * Constructor for SsdWebserviceProvider
     *
     * @param url the base url where the SSD servive is available
     */
    constructor(url: string) {
        if (!url.endsWith('/')) {
            url += '/'
        }
        this.ssdUrl = new URL(this.SSD_ENDPOINT, url)
        this.piUrl = new URL(this.PI_ENDPOINT, url)
    }

    /**
     * Get the base url for SSD requests
     */
    private getSSDUrl(): string {
        return this.ssdUrl.toString()
    }

    /**
     * Get the base url for PI requests
     */
    private getPiUrl(): string {
        return this.piUrl.toString()
    }

    /**
     * Get the url to retrieve SSD capabilities
     */
    private getUrlForCapabilities(): string {
        const request = '?request=GetCapabilities&format=application/json'
        return encodeURI(this.getSSDUrl() + request)
    }

    public async getSvg(url: string): Promise<SVGElement> {
        const webservice = new PiRestService(this.getSSDUrl());
        const requestOptions = new RequestOptions();
        requestOptions.relativeUrl = false;
        const svgResponse = await webservice.getData(url, requestOptions, new SvgElementParser());
        if (svgResponse.responseCode != 200) {
            throw new Error(svgResponse.errorMessage);
        }
        return svgResponse.data;
    }

    /**
     * Retrieve the SSD actions for a specific SVG element on a specific panel
     * Raises an error if the element is not part of the FEWS namespace
     */
    public getActionFromElement(request: ActionFromElementRequest): Promise<ElementAction> {
        const objectId = request.svgElement.getAttributeNS(FEWS_NAMESPACE, "id")
        if (objectId == null) {
            throw new Error("SVG element is not part of the FEWS namespace")
        }
        const actionRequest = {} as ActionRequest;
        actionRequest.panelId = request.panelId;
        actionRequest.objectId = objectId;
        actionRequest.type = request.clickType;
        actionRequest.timeZero = request.timeZero;
        actionRequest.options = request.options;
        actionRequest.baseUrl = this.getSSDUrl();

        const promise = this.getAction(actionRequest);
        return promise.then((action: Action) => {
            return {id: objectId, action: action}
        })
    }

    /**
     * Retrieve a PI timeseries using the request path supplied in a action
     */
    public async fetchPiRequest(request: string): Promise<FewsPiTimeSeriesResponse> {
        const webservice = new PiRestService(this.getPiUrl());
        request = request.startsWith("/") ? request : "/" + request;
        const result = await webservice.getData(request, new RequestOptions(), new DefaultParser<FewsPiTimeSeriesResponse>());
        if (result.responseCode != 200) {
            throw new Error(result.errorMessage);
        }
        return result.data;
    }

    /**
     * Retrieve the SSD actions for a specific object id on a specific panel
     */
    public async getAction(actionRequest: ActionRequest): Promise<Action> {
        const url = ActionRequestBuilder.getUrlForAction(actionRequest);
        const webservice = new PiRestService(this.getSSDUrl());
        const result = await webservice.getData(url, new RequestOptions(), new DefaultParser<Action>());
        if (result.responseCode != 200) {
            throw new Error(result.errorMessage);
        }
        return result.data;
    }

    /**
     * Get the url to retrieve an SSD panel
     */
    public urlForPanel(panelName: string, date: Date): string {
        const dateString = date.toISOString().split('.')[0] + 'Z'
        const request = '?request=GetDisplay&ssd=' + panelName + '&time=' + dateString
        return encodeURI(this.getSSDUrl() + request)
    }

    /**
     * Retrieve the SSD capabilities
     */
    public async getCapabilities(excludeGroups: ExcludeGroups = {displayGroups: []}): Promise<Capabilities> {
        const excludedGroupsNames: string[] = excludeGroups.displayGroups.map((group: ExcludeGroupsDisplayName) => {
            return group.name
        });
        const webservice = new PiRestService(this.getSSDUrl());
        const parser = new CapabilitiesParsers(excludedGroupsNames);
        const result = await webservice.getData("?request=GetCapabilities&format=application/json", new RequestOptions(), parser);
        if (result.responseCode != 200) {
            throw new Error(result.errorMessage);
        }
        return result.data;

    }

}
