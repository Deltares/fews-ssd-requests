/**
 * The SsdWebserviceProvider class is used to obtain
 * Schematic Status Display (SSD) data and process it
 */

import { getUrlForAction } from "./requestbuilder/getUrlForAction.js";
import type { ActionRequest } from "./response/requests/actionRequest.js";
import { ElementAction } from "./response/action/elementAction.js";
import { FEWS_NAMESPACE } from "./response/FEWS_NAME_SPACE.js";
import { CapabilitiesParsers } from "./parser/capabilitiesParsers.js";
import { TimeSeriesResponse as FewsPiTimeSeriesResponse } from '@deltares/fews-pi-requests'
import { SvgElementParser } from "./parser/svgElementParser.js";
import {PiRestService, RequestOptions, type TransformRequestFunction} from "@deltares/fews-web-oc-utils";
import {
    ExcludeGroups,
    ExcludeGroupsDisplayName,
    SsdActionsResponse,
    SsdGetCapabilitiesResponse
} from "./response/index.js";


export class SsdWebserviceProvider {
    private _ssdUrl: URL
    private _piUrl: URL
    private readonly SSD_ENDPOINT = 'ssd'
    private readonly PI_ENDPOINT = ''
    private piWebservice: PiRestService
    private ssdWebservice: PiRestService

    /**
     * Constructor for SsdWebserviceProvider
     *
     * @param url the base url where the SSD servive is available
     * @param {Object} [options] Optional constructor options
     * @param {TransformRequestFunction} [options.transformRequestFn] A function that can be used to modify the Request
     * before it is sent to the server. This function takes a Request as a parameter and returns the modified Request.
     * If this option is not specified, the Request will be sent as is.
     */
    constructor(url: string, options: {transformRequestFn?: TransformRequestFunction} = {}) {
        if (!url.endsWith('/')) {
            url += '/'
        }
        this._ssdUrl = new URL(this.SSD_ENDPOINT, url)
        this._piUrl = new URL(this.PI_ENDPOINT, url)
        this.piWebservice = new PiRestService(this.getPiUrl(), options.transformRequestFn)
        this.ssdWebservice = new PiRestService(this.getSSDUrl(), options.transformRequestFn)
    }

    /**
     * Get the base url for SSD requests
     */
    private getSSDUrl(): string {
        return this._ssdUrl.toString()
    }

    /**
     * Get the base url for PI requests
     */
    private getPiUrl(): string {
        return this._piUrl.toString()
    }

    public async getSvg(url: string): Promise<SVGElement> {
        const requestOptions = new RequestOptions();
        requestOptions.relativeUrl = false;
        const svgResponse = await this.ssdWebservice.getDataWithParser(url, requestOptions, new SvgElementParser());
        if (svgResponse.responseCode != 200) {
            throw new Error(svgResponse.errorMessage);
        }
        return svgResponse.data;
    }

    /**
     * Retrieve the SSD actions for a specific SVG element on a specific panel
     * Raises an error if the element is not part of the FEWS namespace
     */
    public async getActionFromElement(element: SVGElement, actionRequest: ActionRequest): Promise<ElementAction> {
        const objectId = element.getAttributeNS(FEWS_NAMESPACE, "id")
        if (objectId == null) {
            throw new Error(`No element with 'fews:id=${objectId}] present`)
        }
        actionRequest.objectId = objectId;
        const promise = this.getAction(actionRequest as ActionRequest);
        return promise.then((action) => {
            return {id: objectId, action: action}
        })
    }

    /**
     * Retrieve a PI timeseries using the request path supplied in a action
     */
    public async fetchPiRequest(request: string): Promise<FewsPiTimeSeriesResponse> {
        request = request.startsWith("/") ? request : "/" + request;
        const result = await this.piWebservice.getData<FewsPiTimeSeriesResponse>(request);
        if (result.responseCode != 200) {
            throw new Error(result.errorMessage);
        }
        return result.data;
    }

    /**
     * Retrieve the SSD actions for a specific object id on a specific panel
     */
    public async getAction(actionRequest: ActionRequest): Promise<SsdActionsResponse> {
        const url = getUrlForAction(actionRequest);
        const result = await this.ssdWebservice.getData<SsdActionsResponse>(url);
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
    public async getCapabilities(excludeGroups: ExcludeGroups = {displayGroups: []}): Promise<SsdGetCapabilitiesResponse> {
        const excludedGroupsNames: string[] = excludeGroups.displayGroups.map((group: ExcludeGroupsDisplayName) => {
            return group.name
        });
        const parser = new CapabilitiesParsers(excludedGroupsNames);
        const result = await this.ssdWebservice.getDataWithParser<SsdGetCapabilitiesResponse>("?request=GetCapabilities&format=application/json", new RequestOptions(), parser);
        if (result.responseCode != 200) {
            throw new Error(result.errorMessage);
        }
        return result.data;

    }

}
