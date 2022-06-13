import {JsonParser} from "./JsonParser.js";

export class DefaultParser<T> implements JsonParser<T> {
    parse(jsonResponse: any): T {
        return jsonResponse;
    }
}
