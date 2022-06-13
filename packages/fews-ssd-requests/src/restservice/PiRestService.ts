import {RequestOptions} from "./RequestOptions.js";
import {DataRequestResult} from "./DataRequestResult.js";
import {JsonParser} from "../parser/JsonParser.js";

export class PiRestService {
    private readonly webserviceUrl: string;

    constructor(webserviceUrl: string) {
        this.webserviceUrl = webserviceUrl;
    }

    public async getData<T>(url: string, requestOption: RequestOptions, parser: JsonParser<T>): Promise<DataRequestResult<T>> {
        const requestUrl = this.webserviceUrl + "/" + url;
        const options = requestOption.generateOptions();
        const dataRequestResult = {} as DataRequestResult<T>;
        const responseJson = await fetch(requestUrl, options);
        dataRequestResult.responseCode = responseJson.status;
        if (!responseJson.ok) {
            dataRequestResult.errorMessage = await responseJson.text();
            return dataRequestResult;
        }
        const response = await responseJson.json();
        dataRequestResult.data = parser.parse(response);
        return dataRequestResult;
    }
}
