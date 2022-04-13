import RequestOptions from "./RequestOptions";
import DataRequestResult from "./DataRequestResult";
import ResponseParser from "../parser/ResponseParser";

export default class PiRestService {
    private readonly webserviceUrl: string;

    constructor(webserviceUrl: string) {
        this.webserviceUrl = webserviceUrl;
    }

    public async getData<T>(url: string, requestOption: RequestOptions, parser: ResponseParser<T>): Promise<DataRequestResult<T>> {
        const requestUrl = requestOption.relativeUrl ? this.webserviceUrl + url : url;
        const options = requestOption.generateOptions();
        const dataRequestResult = {} as DataRequestResult<T>;
        const res = await fetch(requestUrl);
        dataRequestResult.responseCode = res.status;
        if (res.status != 200) {
            dataRequestResult.errorMessage = res.statusText;
            return dataRequestResult;
        }
        try {
            dataRequestResult.data = await parser.parse(res);
        } catch(e: any) {
            e.message += `\n When loading ${url}.`
            throw e;
        }
        return dataRequestResult;
    }
}
