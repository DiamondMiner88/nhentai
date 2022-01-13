import { Doujin } from './doujin';
import { APISearchResult } from './apitypes';

export class SearchResult {
	/**
	 * Search results
	 */
	readonly doujins: Doujin[];

	/**
	 * Queryable page count in the API
	 */
	readonly numPages: number;

	/**
	 * Number of doujins per page
	 */
	readonly doujinsPerPage: number;

	/**
	 * @hidden
	 * @param raw API data
	 */
	constructor(raw: APISearchResult) {
		this.doujins = raw.result.map(doujin => new Doujin(doujin));
		this.numPages = raw.num_pages;
		this.doujinsPerPage = raw.per_page;
	}
}
