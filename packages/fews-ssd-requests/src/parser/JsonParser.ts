export interface JsonParser<T> {
    parse(response: any): Promise<T>;
}
