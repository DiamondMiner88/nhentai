import Doujin from './doujin';
import { API, APISearchResult } from './api';

export default class SearchResult {
    readonly doujins: Doujin[];

    /**
     * Number of pages that the api searched
     * Unknown how to control it
     */
    readonly numPages: number;

    /**
     * Number of doujins per page the api used
     * Unknown how to control it
     */
    readonly doujinsPerPage: number;

    /**
     * Raw response from the API
     */
    readonly raw?: APISearchResult;

    constructor(raw: APISearchResult, api: API) {
        this.doujins = raw.result.map(doujin => new Doujin(doujin, api));
        this.numPages = raw.num_pages;
        this.doujinsPerPage = raw.per_page;
        if (api.options.preserveRaw) this.raw = raw;
    }
}
