import Doujin from './doujin';

export default class SearchResult {
    readonly doujins: Doujin[];
    readonly amount: number;
    readonly numPages: number;
    readonly doujinsPerPage: number;

    constructor(searchresult: any, apiOptions: any) {
        this.doujins = searchresult.result.map((doujin: any) => new Doujin(doujin, apiOptions));
        this.amount = searchresult.result.length;
        this.numPages = searchresult.num_pages;
        this.doujinsPerPage = searchresult.per_page;
    }
}
