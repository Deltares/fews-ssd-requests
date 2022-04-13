export default interface ResponseParser<T> {
    parse(response: Response): Promise<T>;
}
