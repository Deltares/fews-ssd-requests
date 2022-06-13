import {JsonParser} from "./JsonParser.js";

export class DefaultParser<T> implements JsonParser<T> {
    parse(response: any): Promise<T> {
        return response.json();
    }
}
