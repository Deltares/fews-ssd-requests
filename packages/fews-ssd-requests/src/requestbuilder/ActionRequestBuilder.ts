import {ActionRequest} from "@/data/requests/ActionRequest";

export default class ActionRequestBuilder {
    /**
     * Get the url to retrieve a SSD actions for a specific object on a specific panel
     */
    public static getUrlForAction(actionRequest: ActionRequest): string {
        const clickType = actionRequest.type === undefined ? "LEFTSINGLECLICK" : actionRequest.type;
        let request = `?request=GetAction&ssd=${actionRequest.panelId}&action=${clickType}&objectid=${actionRequest.objectId}&format=application/json`;
        if (actionRequest.timeZero !== undefined) request += `&timezero=${actionRequest.timeZero}`;
        if (actionRequest.options !== undefined) request += `&options=${actionRequest.options.join(',')}`;
        return request;
    }
}
