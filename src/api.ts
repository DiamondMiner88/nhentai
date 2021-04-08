import fetch from 'node-fetch';
import { APIDoujin, APISearchResult } from './apitypes';
import { Doujin } from './doujin';
import { SearchResult } from './search';

// TODO: confirm that popular actually sorts by favorites
export enum SortMethods {
    /**
     * Sort by most recently published
     */
    RECENT = '',
    /**
     * Sort by amount of favorites
     */
    POPULAR_ALL_TIME = 'popular',
    /**
     * Sort by amount of favorites gained in the last 7 days
     */
    POPULAR_THIS_WEEK = 'popular-week',
    /**
     * Sort by amount of favorites gained in the last 24 hours
     */
    POPULAR_TODAY = 'popular-today'
}

const SortValues = Object.values(SortMethods);

export const HOST_URL = 'https://nhentai.net';
export const IMAGE_URL = 'https://i.nhentai.net';
export const THUMBS_URL = 'https://t.nhentai.net';
export const API_URL = HOST_URL + '/api';

export class API {
    /**
     * Constuct a new API wrapper
     * @param options.preserveRaw Save the raw doujin to `Doujin#raw`
     */
    constructor(public options = { preserveRaw: false }) {}

    /**
     * Wrapper over node-fetch that checks for api errors
     * @param path API path
     * @returns parsed JSON
     */
    private async fetch(path: string): Promise<unknown> {
        return fetch(API_URL + path)
            .then(res => res.json())
            .then(json => {
                if (json.error) throw new nhentaiAPIError(json, path);
                else return json;
            });
    }

    /**
     * Check if a doujin exists
     * @param doujinID ID of the doujin
     */
    doujinExists(doujinID: number | string): Promise<boolean> {
        doujinID = Number(doujinID);
        if (isNaN(doujinID)) throw new TypeError('id is not a parsable number');
        if (doujinID <= 0) throw new RangeError('id cannot be lower than 1');

        return fetch(`${API_URL}/gallery/${doujinID}`, { method: 'HEAD' }).then(res => {
            if (![200, 404].includes(res.status)) throw new Error(`Status code is not a 404 or 200. (${res.status})`);
            return res.status === 200;
        });
    }

    /**
     * Fetch a doujin
     * @param doujinID ID of the doujin.
     */
    async fetchDoujin(doujinID: number | string): Promise<Doujin | undefined> {
        doujinID = Number(doujinID);
        if (isNaN(doujinID)) throw new TypeError('id is not a parsable number');
        if (doujinID <= 0) throw new RangeError('id cannot be lower than 1');

        return this.fetch(`/gallery/${doujinID}`)
            .then(data => new Doujin(data as APIDoujin, this))
            .catch(err => {
                if (err.message === 'does not exist') return undefined;
            });
    }

    /**
     * Get doujins shown on the homepage. Alias for `search('*', [...])`
     */
    fetchHomepage(page: string | number = 1, sort = SortMethods.RECENT): Promise<SearchResult> {
        return this.search('*', page, sort);
    }

    /**
     * Search nhentai for any doujin that matches the query in any titles
     */
    async search(query: string, page: string | number = 1, sort = SortMethods.RECENT): Promise<SearchResult> {
        if (isNaN(Number(page))) throw new TypeError('page is not a parsable number');

        const res = await this.fetch(`/galleries/search?query=${query}&page=${page}&sort=${sort}`);
        return new SearchResult(res as APISearchResult, this);
    }

    /**
     * Searches nhentai for doujins that have this tag
     * @param tagID ID of the tag
     */
    async searchByTagID(
        tagID: number | string,
        page: string | number = 1,
        sort = SortMethods.RECENT
    ): Promise<SearchResult> {
        if (isNaN(Number(tagID))) throw new TypeError('page is not a parsable number');
        if (isNaN(Number(page))) throw new TypeError('tagId is not a parsable number');
        if (!SortValues.includes(sort)) throw new TypeError('sort method is not one of the available');

        const res = await this.fetch(`/galleries/tagged?tag_id=${tagID}&page=${page}${sort ? `&sort=${sort}` : ''}`);
        return new SearchResult(res as APISearchResult, this);
    }

    /**
     * Find similar doujins
     * @param doujinID ID of the doujin
     */
    async searchRelated(doujinID: number | string, page: string | number = 1): Promise<SearchResult> {
        if (isNaN(Number(doujinID))) throw new TypeError('id is not a parsable number');
        if (isNaN(Number(page))) throw new TypeError('page is not a parsable number');

        const res = await this.fetch(`/gallery/${doujinID}/related`);
        return new SearchResult(res as APISearchResult, this);
    }

    /**
     * Get a random doujin by using nhentai's `/random` endpoint which redirects to a doujin and the url is captured.
     */
    async randomDoujinID(): Promise<number> {
        return fetch(`${HOST_URL}/random`, { method: 'HEAD' }).then(data => {
            const match = data.url.match(/https?:\/\/nhentai\.net\/g\/(\d{1,7})\//);
            if (!match || !match[1]) throw new Error('Could not find doujin id in redirect url.');
            return Number(match[1]);
        });
    }

    /**
     * Gets a random doujin using `randomDoujinID()` and `fetchDoujin()`
     */
    async randomDoujin(): Promise<Doujin> {
        const id = await this.randomDoujinID();
        const doujin = await this.fetchDoujin(id);
        if (!doujin) throw new Error('Failed to retrieve doujin that exists. Please try again.');
        return doujin;
    }
}

export class nhentaiAPIError extends Error {
    response: Record<string, unknown>;
    url: string;
    constructor(response: Record<string, unknown>, url: string) {
        super(JSON.stringify(response));
        this.response = response;
        this.url = url;
        this.name = 'nhentaiAPIError';
        Error.captureStackTrace(this, nhentaiAPIError);
    }
}
