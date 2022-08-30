import { RequestOptions } from "./requestOptions";
import { DataRequestResult } from "./dataRequestResult";
import { ResponseParser } from "../parser/responseParser";

export class PiRestService {
    private readonly webserviceUrl: string;

    constructor(webserviceUrl: string) {
        this.webserviceUrl = webserviceUrl;
    }

    public async getData<T>(url: string): Promise<DataRequestResult<T>> {
        const requestUrl = url.startsWith("http") ? url : this.webserviceUrl + url;
        const dataRequestResult = {} as DataRequestResult<T>;
        const res = await fetch(requestUrl);
        dataRequestResult.responseCode = res.status;
        if (res.status != 200) {
            dataRequestResult.errorMessage = res.statusText;
            return dataRequestResult;
        }
        try {
            dataRequestResult.data = await res.json();
        } catch (e: any) {
            e.message += `\n When loading ${url}.`
            throw e;
        }
        return dataRequestResult;
    }


    public async getDataWithParser<T>(url: string, requestOption: RequestOptions, parser: ResponseParser<T>): Promise<DataRequestResult<T>> {
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
        } catch (e: any) {
            e.message += `\n When loading ${url}.`
            throw e;
        }
        return dataRequestResult;
    }
}
