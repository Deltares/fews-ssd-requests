export default interface JsonParser<T> {
    parse(jsonResponse: any): T;
}
