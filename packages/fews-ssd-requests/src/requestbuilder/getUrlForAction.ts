import { ActionRequest } from "../response/requests/actionRequest.js";

/**
 * Get the url to retrieve a SSD actions for a specific object on a specific panel
 */
export function getUrlForAction(actionRequest: ActionRequest): string {
    const clickType = actionRequest.clickType === undefined ? "LEFTSINGLECLICK" : actionRequest.clickType;
    let request = `?request=GetAction&ssd=${actionRequest.panelId}&action=${clickType}&objectid=${actionRequest.objectId}`;
    if (actionRequest.timeZero !== undefined) request += `&timezero=${actionRequest.timeZero}`;
    if (actionRequest.convertDatum !== undefined) request += `&convertDatum=${actionRequest.convertDatum}`;
    if (actionRequest.useDisplayUnits !== undefined) request += `&useDisplayUnits=${actionRequest.useDisplayUnits}`;
    if (actionRequest.options !== undefined) request += `&options=${actionRequest.options.join(',')}`;
    if (actionRequest.config !== false) request += `&config=true`;
    request += '&format=application/json'
   return request;
}

