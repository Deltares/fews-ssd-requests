import JsonParser from "@/parser/JsonParser";
import {Action} from "@/data";

export default class DefaultParser<T> implements JsonParser<T> {
    parse(jsonResponse: any): T {
        return jsonResponse;
    }
}
