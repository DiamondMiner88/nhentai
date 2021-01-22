import fetch from 'node-fetch';
import Doujin from './doujin';
import SearchResult from './search';

export interface APIDoujin {
    id: number;
    media_id: string;
    title: {
        english: string;
        japanese: string;
        pretty: string;
    };
    images: {
        pages: APIImage[];
        cover: APIImage;
        thumbnail: APIImage;
    };
    scanlator: string;
    upload_date: number;
    tags: APITag[];
    num_pages: number;
    num_favorites: number;
}

export interface APITag {
    id: number;
    type: 'tag' | 'category' | 'artist' | 'parody' | 'character' | 'group' | 'language';
    name: string;
    url: string;
    count: number;
}

export interface APIImage {
    t: 'g' | 'j' | 'p';
    w: number;
    h: number;
}

export interface APISearchResult {
    result: APIDoujin[];
    num_pages: number;
    per_page: number;
}

export enum SortMethods {
    /**
     * Sort by when uploaded
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

export const HOST_URL = 'https://nhentai.net';
export const IMAGE_URL = 'https://i.nhentai.net';
export const THUMBS_URL = 'https://t.nhentai.net';
export const API_URL = HOST_URL + '/api';

export class API {
    options: {
        preserveRaw: boolean;
    };

    /**
     * Constuct a new API wrapper
     * @param options.preserveRaw Save the raw doujin to `Doujin#raw`
     */
    constructor(options = { preserveRaw: false }) {
        this.options = options;
    }

    /**
     * Check if a doujin exists
     * @param doujinID ID of the doujin
     */
    doujinExists(doujinID: number | string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (isNaN(+doujinID)) return reject(new Error('DoujinID paramater is not a number.'));
            if (+doujinID <= -1) return reject(new Error('DoujinID cannot be lower than 1.'));

            fetch(`${API_URL}/gallery/${doujinID}`, { method: 'HEAD' })
                .then(res => {
                    if (res.status !== 200 && res.status !== 404)
                        reject(new Error(`Response code is not a 404 or 200. (${res.status})`));
                    else resolve(res.status === 200);
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Fetch a doujin
     * @param doujinID ID of the doujin. Commonly known as as a '6 digit number'
     */
    fetchDoujin(doujinID: number | string): Promise<Doujin | undefined> {
        return new Promise((resolve, reject) => {
            if (isNaN(+doujinID)) return reject(new Error('DoujinID paramater is not a number.'));
            if (+doujinID <= -1) return reject(new Error('DoujinID cannot be lower than 1.'));

            const url = `${API_URL}/gallery/${doujinID}`;
            fetch(url)
                .then(data => data.json())
                .then(data => {
                    if (data.error) {
                        if (data.error === 'does not exist') resolve(undefined);
                        else reject(new nhentaiAPIError(data, url));
                    } else resolve(new Doujin(data, this));
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Get doujins shown on the homepage. Alias for `search('*', [...])`
     */
    fetchHomepage(page: string | number = 1, sort = ''): Promise<SearchResult> {
        return this.search('*', page, sort);
    }

    /**
     * Search nhentai for any doujin that matches the query in any titles
     */
    search(query: string, page: string | number = 1, sort = ''): Promise<SearchResult> {
        return new Promise((resolve, reject) => {
            if (isNaN(+page)) return reject(new Error('Page paramater is not a number.'));

            const sorting = !!sort ? `&sort=${sort}` : '';
            const url = `${API_URL}/galleries/search?query=${query}&page=${page}${sorting}`;
            fetch(url)
                .then(data => data.json())
                .then(data => {
                    if (data.error) reject(new nhentaiAPIError(data, url));
                    else resolve(new SearchResult(data, this));
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Searches nhentai for doujins that have this tag
     * @param tagID ID of the tag
     */
    searchByTagID(tagID: number | string, page: string | number = 1, sort = ''): Promise<SearchResult> {
        return new Promise((resolve, reject) => {
            if (isNaN(+page)) return reject(new Error('Page paramater is not a number.'));
            if (isNaN(+tagID)) return reject(new Error('TagID paramater is not a number'));

            const sorting = !!sort ? `&sort=${sort}` : '';
            const url = `${API_URL}/galleries/tagged?tag_id=${tagID}&page=${page}${sorting}`;
            fetch(url)
                .then(data => data.json())
                .then(data => {
                    if (data.error) reject(new nhentaiAPIError(data, url));
                    else resolve(new SearchResult(data, this));
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Find similar doujins
     * @param doujinID ID of the doujin
     */
    searchRelated(doujinID: number | string, page: string | number = 1): Promise<SearchResult> {
        return new Promise((resolve, reject) => {
            if (isNaN(+page)) return reject(new Error('Page paramater is not a number.'));
            if (isNaN(+doujinID)) return reject(new Error('DoujinID paramater is not a number'));

            const url = `${API_URL}/gallery/${doujinID}/related`;
            fetch(url)
                .then(data => data.json())
                .then(data => {
                    if (data.error) reject(new nhentaiAPIError(data, url));
                    else resolve(new SearchResult(data, this));
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Get a random doujin by using nhentai's `/random` endpoint which redirects to a doujin and the url is captured.
     */
    randomDoujinID(): Promise<number> {
        return new Promise((resolve, reject) => {
            fetch(`${HOST_URL}/random`, { method: 'HEAD' })
                .then(data => {
                    const match = data.url.match(/https?:\/\/nhentai\.net\/g\/(\d{1,7})\//);
                    if (!match || !match[1]) return reject(new Error('Could not find doujin id in redirect url.'));
                    resolve(+match[1]);
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Gets a random doujin using `randomDoujinID()` and `fetchDoujin()`
     */
    randomDoujin(): Promise<Doujin> {
        return new Promise((resolve, reject) => {
            this.randomDoujinID()
                .then((doujinID: number) =>
                    this.fetchDoujin(doujinID).then(doujin => {
                        if (!doujin)
                            reject(new Error("Random doujin is now not accessible, this shouldn't happen again."));
                        else resolve(doujin);
                    })
                )
                .catch(error => reject(error));
        });
    }
}

export class nhentaiAPIError extends Error {
    response: Record<string, unknown>;
    url: string;
    constructor(response: Record<string, unknown>, url: string) {
        super('API returned an error');
        this.response = response;
        this.url = url;
        this.name = 'nhentaiAPIError';
        Error.captureStackTrace(this, nhentaiAPIError);
    }
}
