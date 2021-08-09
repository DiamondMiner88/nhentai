import { Doujin } from './doujin';
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
     * Internal constructor. Use only if you know what you are doing.
     * @param raw Raw data
     */
    constructor(raw: APISearchResult) {
        this.doujins = raw.result.map(doujin => new Doujin(doujin));
        this.numPages = raw.num_pages;
        this.doujinsPerPage = raw.per_page;
    }
}
