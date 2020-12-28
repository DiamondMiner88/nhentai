import Doujin from './doujin';
import { APISearchResult } from './apitypes';
import { API } from './api';

export default class SearchResult {
    readonly doujins: Doujin[];
    readonly numPages: number;
    readonly doujinsPerPage: number;

    constructor(searchresult: APISearchResult, api: API) {
        this.doujins = searchresult.result.map(doujin => new Doujin(doujin, api));
        this.numPages = searchresult.num_pages;
        this.doujinsPerPage = searchresult.per_page;
    }
}
