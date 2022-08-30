/**
 * The SsdWebserviceProvider class is used to obtain
 * Schematic Status Display (SSD) data and process it
 */
import { Action, Capabilities, ExcludeGroups, ExcludeGroupsDisplayName } from "./response";
import { getUrlForAction } from "./requestbuilder/getUrlForAction";
import { ActionRequest } from "./response/requests/actionRequest";
import { PiRestService } from "./restservice/piRestService";
import { RequestOptions } from "./restservice/requestOptions";
import { ElementAction } from "./response/action/elementAction";
import { FEWS_NAMESPACE } from "./response/FEWS_NAME_SPACE";
import { CapabilitiesParsers } from "./parser/capabilitiesParsers";
import { TimeSeriesResponse as FewsPiTimeSeriesResponse } from '@deltares/fews-pi-requests'
import { SvgElementParser } from "./parser/svgElementParser";

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
        const svgResponse = await webservice.getDataWithParser(url, requestOptions, new SvgElementParser());
        if (svgResponse.responseCode != 200) {
            throw new Error(svgResponse.errorMessage);
        }
        return svgResponse.data;
    }

    /**
     * Retrieve the SSD actions for a specific SVG element on a specific panel
     * Raises an error if the element is not part of the FEWS namespace
     */
    public getActionFromElement(element: SVGElement, actionRequest: Partial<ActionRequest>): Promise<ElementAction> {
        const objectId = element.getAttributeNS(FEWS_NAMESPACE, "id")
        if (objectId == null) {
            throw new Error(`No element with 'fews:id=${objectId}] present`)
        }
        actionRequest.objectId = objectId;
        const promise = this.getAction(actionRequest as ActionRequest);
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
        const result = await webservice.getData<FewsPiTimeSeriesResponse>(request);
        if (result.responseCode != 200) {
            throw new Error(result.errorMessage);
        }
        return result.data;
    }

    /**
     * Retrieve the SSD actions for a specific object id on a specific panel
     */
    public async getAction(actionRequest: ActionRequest): Promise<Action> {
        const url = getUrlForAction(actionRequest);
        const webservice = new PiRestService(this.getSSDUrl());
        const result = await webservice.getData<Action>(url);
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
        const result = await webservice.getDataWithParser<Capabilities>("?request=GetCapabilities&format=application/json", new RequestOptions(), parser);
        if (result.responseCode != 200) {
            throw new Error(result.errorMessage);
        }
        return result.data;

    }

}
