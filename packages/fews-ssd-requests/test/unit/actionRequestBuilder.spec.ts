import ActionRequestBuilder from "../../src/requestbuilder/actionRequestBuilder";
import {ActionRequest} from "../../src/response/requests/actionRequest";

const apiEndpoint = "FewsWebServices/ssd";
describe('action request test', () => {
    it("gives the correct url to an action", function () {
        const baseUrl = process.env.TEST_URL || "";
        const panelId = "SomePanelId";
        const objectId = "SomeObjectId";
        const actionRequest = {} as ActionRequest;
        actionRequest.panelId = panelId;
        actionRequest.objectId = objectId;
        actionRequest.clickType= 'LEFTSINGLECLICK';
        const url = ActionRequestBuilder.getUrlForAction(actionRequest);
        const expected = "?request=GetAction&ssd=" + panelId + "&action=LEFTSINGLECLICK&objectid=" + objectId + "&format=application/json";
        expect(url).toEqual(expected);
    });
})
