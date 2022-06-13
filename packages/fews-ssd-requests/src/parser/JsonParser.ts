export interface JsonParser<T> {
    parse(jsonResponse: any): T;
}
