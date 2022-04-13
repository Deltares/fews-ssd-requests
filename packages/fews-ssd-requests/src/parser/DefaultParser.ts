import ResponseParser from "@/parser/ResponseParser";
import {Action} from "@/data";

export default class DefaultParser<T> implements ResponseParser<T> {
    async parse(response: Response): Promise<T> {
        const result: T = await response.json();
        return result
    }
}
