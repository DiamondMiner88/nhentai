import fetch from 'node-fetch';
import { APIDoujin, APISearchResult, APISearchOptions } from './apitypes';
import { Doujin } from './doujin';
import { SearchResult } from './search';
import { API_URL, HOST_URL, SortMethods } from './constants';

export class API {
    /**
     * Constuct a new API wrapper
     */
    constructor(public options = {}) {}

    /**
     * Node-fetch wrapper that handles api errors
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
     * @param id ID of the doujin
     */
    doujinExists(id: number): Promise<boolean> {
        if (id <= 0) throw new RangeError('id cannot be lower than 1');

        return fetch(`${API_URL}/gallery/${id}`, { method: 'HEAD' }).then(res => {
            switch (res.status) {
                case 200:
                    return true;
                case 404:
                    return false;
                default:
                    throw new Error(`Status code is not a 404 or 200. (${res.status})`);
            }
        });
    }

    /**
     * Fetch a doujin
     * @param id ID of the doujin.
     */
    async fetchDoujin(id: number): Promise<Doujin | null> {
        if (id <= 0) throw new RangeError('id cannot be lower than 1');

        return this.fetch(`/gallery/${id}`)
            .then(data => new Doujin(data as APIDoujin))
            .catch(err => {
                if (err.response?.error === 'does not exist') return null;
                throw err;
            });
    }

    /**
     * Fetch homepage doujins
     * @param options Search Options
     */
    fetchHomepage(options: APISearchOptions = {}): Promise<SearchResult> {
        return this.search('*', options);
    }

    /**
     * Search by string query
     * @param options Search Options
     */
    async search(query: string, options: APISearchOptions = {}): Promise<SearchResult> {
        const res = await this.fetch(`/galleries/search?query=${query}${options.language ? ` ${options.language}` : ''}&page=${options.page || '1'}&sort=${options.sort || SortMethods.RECENT}`);
        return new SearchResult(res as APISearchResult);
    }

    /**
     * Search doujins with this tag
     * @param id Tag ID
     * @param options Search Options
     */
    async searchByTagID(id: number, options: APISearchOptions = {}): Promise<SearchResult> {
        // An empty &sort query param causes an error
        const res = await this.fetch(`/galleries/tagged?tag_id=${id}&page=${options.page ? `${options.page}` : 1}${options.sort ? `&sort=${options.sort}` : ''}`);
        return new SearchResult(res as APISearchResult);
    }

    /**
     * Find similar doujins
     * @param id Doujin ID
     */
    async searchRelated(id: number): Promise<SearchResult> {
        const res = await this.fetch(`/gallery/${id}/related`);
        return new SearchResult(res as APISearchResult);
    }

    /**
     * Fetch a random doujin ID
     */
    async randomDoujinID(): Promise<number> {
        return fetch(`${HOST_URL}/random`, { method: 'HEAD' }).then(data => {
            const match = data.url.match(/https?:\/\/nhentai\.net\/g\/(\d{1,7})\//);
            if (!match || !match[1]) throw new Error('Could not find doujin id in redirect url.');
            return Number(match[1]);
        });
    }

    /**
     * Fetch a random doujin
     */
    async randomDoujin(): Promise<Doujin> {
        const id = await this.randomDoujinID();
        const doujin = await this.fetchDoujin(id);
        if (!doujin) throw new Error('Failed to retrieve doujin that exists. Please try again.');
        return doujin;
    }
}

/**
 * Represents errors returned by the api (not network)
 */
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
