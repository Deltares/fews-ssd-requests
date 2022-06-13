import {RequestOptions} from "./RequestOptions.js";
import {DataRequestResult} from "./DataRequestResult.js";
import {JsonParser} from "../parser/JsonParser.js";

export class PiRestService {
    private readonly webserviceUrl: string;

    constructor(webserviceUrl: string) {
        this.webserviceUrl = webserviceUrl;
    }

    public async getData<T>(url: string, requestOption: RequestOptions, parser: JsonParser<T>): Promise<DataRequestResult<T>> {
        const requestUrl =  requestOption.relativeUrl ? this.webserviceUrl + url: url
        const options = requestOption.generateOptions();
        const dataRequestResult = {} as DataRequestResult<T>;
        const response = await fetch(requestUrl, options);
        dataRequestResult.responseCode = response.status;
        if (!response.ok) {
            dataRequestResult.errorMessage = await response.text();
            return dataRequestResult;
        }
        dataRequestResult.data = await parser.parse(response);
        return dataRequestResult;
    }
}
