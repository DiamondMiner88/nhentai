import Doujin from './doujin';

export default class SearchResult {
    readonly doujins: Doujin[];
    readonly amount: number;
    readonly numPages: number;
    readonly doujinsPerPage: number;

    constructor(searchresult: any) {
        this.doujins = searchresult.result.map((doujin: any) => new Doujin(doujin));
        this.amount = searchresult.result.length;
        this.numPages = searchresult.num_pages;
        this.doujinsPerPage = searchresult.per_page;
    }
}
