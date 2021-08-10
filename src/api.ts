import fetch from 'node-fetch';
import { APIDoujin, APISearchResult } from './apitypes';
import { Doujin } from './doujin';
import { SearchResult } from './search';

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

// Cached values for argument checking
const SortValues = Object.values(SortMethods);

/**
 * Main website
 */
export const HOST_URL = 'https://nhentai.net';

/**
 * Main image server
 */
export const IMAGE_URL = 'https://i.nhentai.net';

/**
 * Thumbnail server
 */
export const THUMBS_URL = 'https://t.nhentai.net';

/**
 * Base API Url
 */
export const API_URL = HOST_URL + '/api';

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
    doujinExists(id: number | string): Promise<boolean> {
        id = Number(id);

        if (isNaN(id)) throw new TypeError('id is not a number');
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
    async fetchDoujin(id: number | string): Promise<Doujin | null> {
        id = Number(id);

        if (isNaN(id)) throw new TypeError('id is not a number');
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
     */
    fetchHomepage(page: string | number = 1, sort = SortMethods.RECENT): Promise<SearchResult> {
        return this.search('*', page, sort);
    }

    /**
     * Search by string query
     */
    async search(query: string, page: string | number = 1, sort = SortMethods.RECENT): Promise<SearchResult> {
        page = Number(page);

        if (isNaN(page)) throw new TypeError('page is not a number');
        if (!SortValues.includes(sort)) throw new TypeError('sort method is not valid');

        const res = await this.fetch(`/galleries/search?query=${query}&page=${page}&sort=${sort}`);
        return new SearchResult(res as APISearchResult);
    }

    /**
     * Search doujins with this tag
     * @param id Tag ID
     * @param page Page number
     * @param sort API sort method
     */
    async searchByTagID(
        id: number | string,
        page: string | number = 1,
        sort = SortMethods.RECENT
    ): Promise<SearchResult> {
        id = Number(id);
        page = Number(page);

        if (isNaN(id)) throw new TypeError('tagId is not a number');
        if (isNaN(page)) throw new TypeError('page is not a number');
        if (!SortValues.includes(sort)) throw new TypeError('sort method is not valid');

        // An empty &sort query param causes an error
        const res = await this.fetch(`/galleries/tagged?tag_id=${id}&page=${page}${sort ? `&sort=${sort}` : ''}`);
        return new SearchResult(res as APISearchResult);
    }

    /**
     * Find similar doujins
     * @param id Doujin ID
     * @param page Page number
     */
    async searchRelated(id: number | string, page: string | number = 1): Promise<SearchResult> {
        id = Number(id);
        page = Number(page);

        if (isNaN(id)) throw new TypeError('doujinID is not a number');
        if (isNaN(page)) throw new TypeError('page is not a number');

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
