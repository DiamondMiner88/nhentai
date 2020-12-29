import Doujin from './doujin';
import { API, APISearchResult } from './api';

export default class SearchResult {
    /**
     * Doujins that were returned from the search.
     */
    readonly doujins: Doujin[];

    /**
     * Number of pages that the api searched.
     */
    readonly numPages: number;

    /**
     * Number of doujins per page the api used.
     */
    readonly doujinsPerPage: number;

    constructor(searchresult: APISearchResult, api: API) {
        this.doujins = searchresult.result.map(doujin => new Doujin(doujin, api));
        this.numPages = searchresult.num_pages;
        this.doujinsPerPage = searchresult.per_page;
    }
}
