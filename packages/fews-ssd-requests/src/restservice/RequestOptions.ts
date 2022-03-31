export default class RequestOptions {
    private _mode = "cors";
    private _relativeUrl = true;


    get relativeUrl() {
        return this._relativeUrl;
    }

    set relativeUrl(value) {
        this._relativeUrl = value;
    }

    get mode(): string {
        return this._mode;
    }

    set mode(value: string) {
        this._mode = value;
    }

    public generateOptions(): any {
        return Object.assign({},this);
    }
}
