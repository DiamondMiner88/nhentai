import Doujin from './doujin';
import { APISearchResult } from './apitypes';

export default class SearchResult {
    readonly doujins: Doujin[];
    readonly numPages: number;
    readonly doujinsPerPage: number;

    constructor(searchresult: APISearchResult) {
        this.doujins = searchresult.result.map(doujin => new Doujin(doujin));
        this.numPages = searchresult.num_pages;
        this.doujinsPerPage = searchresult.per_page;
    }
}
