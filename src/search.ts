import { Doujin } from './doujin';
import { API } from './api';
import { APISearchResult } from './apitypes';

export class SearchResult {
    readonly doujins: Doujin[];

    /**
     * Number of pages that the api searched\
     * How to change it is unknown
     */
    readonly numPages: number;

    /**
     * Number of doujins per page the api used\
     * How to change it is unknown
     */
    readonly doujinsPerPage: number;

    /**
     * Raw response from the API
     */
    readonly raw?: APISearchResult;

    /**
     * Internal constructor. Use only if you know what you are doing.
     * @param raw Raw data
     * @param api Instance of the api
     */
    constructor(raw: APISearchResult, api: API) {
        this.doujins = raw.result.map(doujin => new Doujin(doujin, api));
        this.numPages = raw.num_pages;
        this.doujinsPerPage = raw.per_page;
        if (api.options.preserveRaw) this.raw = raw;
    }
}
