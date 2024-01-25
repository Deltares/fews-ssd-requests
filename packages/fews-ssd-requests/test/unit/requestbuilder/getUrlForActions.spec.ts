import { getUrlForAction } from "../../../src/requestbuilder/getUrlForAction";
import { ActionRequest } from "../../../src/response/requests/actionRequest";

const apiEndpoint = "ssd";
describe('action request test', () => {
    it("gives the correct url to an action", function () {
        const baseUrl = process.env.TEST_URL || "";
        const panelId = "SomePanelId";
        const objectId = "SomeObjectId";
        const actionRequest = {} as ActionRequest;
        actionRequest.panelId = panelId;
        actionRequest.objectId = objectId;
        actionRequest.clickType= 'LEFTSINGLECLICK';
        const url = getUrlForAction(actionRequest);
        const expected = `?request=GetAction&ssd=${panelId}&action=LEFTSINGLECLICK&objectid=${objectId}&config=true&format=application/json`;
        expect(url).toEqual(expected);
    });
    it("gives the correct url to an action with convertDatum", function () {
        const baseUrl = process.env.TEST_URL || "";
        const panelId = "SomePanelId";
        const objectId = "SomeObjectId";
        const actionRequest = {
            panelId : panelId,
            objectId : objectId,
            clickType: 'LEFTSINGLECLICK',
            convertDatum: true,
        } as const
        const url = getUrlForAction(actionRequest);
        const expected = `?request=GetAction&ssd=${panelId}&action=LEFTSINGLECLICK&objectid=${objectId}&convertDatum=true&config=true&format=application/json`;
        expect(url).toEqual(expected);
    });
    it("gives the correct url to an action with useDisplayUnits", function () {
        const baseUrl = process.env.TEST_URL || "";
        const panelId = "SomePanelId";
        const objectId = "SomeObjectId";
        const actionRequest = {
            panelId : panelId,
            objectId : objectId,
            clickType: 'LEFTSINGLECLICK',
            useDisplayUnits: true,
        } as const
        const url = getUrlForAction(actionRequest);
        const expected = `?request=GetAction&ssd=${panelId}&action=LEFTSINGLECLICK&objectid=${objectId}&useDisplayUnits=true&config=true&format=application/json`;
        expect(url).toEqual(expected);
    });


})
