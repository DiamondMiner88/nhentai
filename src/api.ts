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
    RECENT = '',
    POPULAR_ALL_TIME = 'popular',
    POPULAR_THIS_WEEK = 'popular-week',
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
     * Constuct a new API wrapper.
     * @param options.preserveRaw Save the raw response to `Doujin#raw`
     */
    constructor(options = { preserveRaw: false }) {
        this.options = options;
    }

    /**
     * Checks if a doujins exists
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
     * Fetch a doujin's info.
     * @param doujinID ID of the doujin to get. Commonly referred to as '6 digit number'.
     */
    fetchDoujin(doujinID: number | string): Promise<Doujin | undefined> {
        return new Promise((resolve, reject) => {
            if (isNaN(+doujinID)) return reject(new Error('DoujinID paramater is not a number.'));
            if (+doujinID <= -1) return reject(new Error('DoujinID cannot be lower than 1.'));

            fetch(`${API_URL}/gallery/${doujinID}`)
                .then(data => data.json())
                .then(data => {
                    if (data.error) {
                        if (data.error === 'does not exist') resolve(undefined);
                        else reject(new nhentaiAPIError(data.error));
                    } else resolve(new Doujin(data, this));
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Get the homepage. Alias for `search('*')`
     * @param page Which nhentai page to look on.
     * @param sort How you want to sort the results. If blank sorted by most recently uploaded, otherwise by amount of favorites it with optional limitators like most popular today.
     */
    fetchHomepage(page: string | number = 1, sort = ''): Promise<SearchResult> {
        return this.search('*', page, sort);
    }

    /**
     * Search nhentai for any doujin that matches the query in any titles.
     * @param query String to match against titles.
     * @param page Which nhentai page to look on.
     * @param sort How you want to sort the results. If blank sorted by most recently uploaded, otherwise by amount of favorites it with optional limitators like most popular today.
     */
    search(query: string, page: string | number = 1, sort = ''): Promise<SearchResult> {
        return new Promise((resolve, reject) => {
            if (isNaN(+page)) return reject(new Error('Page paramater is not a number.'));

            const sorting = !!sort ? `&sort=${sort}` : '';
            fetch(`${API_URL}/galleries/search?query=${query}&page=${page}${sorting}`)
                .then(data => data.json())
                .then(data => {
                    if (data.error) reject(new nhentaiAPIError(data.error));
                    else resolve(new SearchResult(data, this));
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Searches nhentai for any doujins that have this tag.
     * @param tagID ID of the tag.
     * @param page Which nhentai page to look on.
     */
    searchByTagID(tagID: number | string, page: string | number = 1, sort = ''): Promise<SearchResult> {
        return new Promise((resolve, reject) => {
            if (isNaN(+page)) return reject(new Error('Page paramater is not a number.'));
            if (isNaN(+tagID)) return reject(new Error('TagID paramater is not a number'));

            const sorting = !!sort ? `&sort=${sort}` : '';
            fetch(`${API_URL}/galleries/tagged?tag_id=${tagID}&page=${page}${sorting}`)
                .then(data => data.json())
                .then(data => {
                    if (data.error) reject(new nhentaiAPIError(data.error));
                    else resolve(new SearchResult(data, this));
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Find similar doujins.
     * @param doujinID ID of the doujin.
     * @param page Which nhentai page to look on.
     */
    searchRelated(doujinID: number | string, page: string | number = 1): Promise<SearchResult> {
        return new Promise((resolve, reject) => {
            if (isNaN(+page)) return reject(new Error('Page paramater is not a number.'));
            if (isNaN(+doujinID)) return reject(new Error('DoujinID paramater is not a number'));

            fetch(`${API_URL}/gallery/${doujinID}/related`)
                .then(data => data.json())
                .then(data => {
                    if (data.error) reject(new nhentaiAPIError(data.error));
                    else resolve(new SearchResult(data, this));
                })
                .catch(error => reject(error));
        });
    }

    /**
     * Gets a random doujin by using nhentai's `/random` user endpoint which redirects to a doujin and the url is captured.
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
     * Gets a random doujin using `randomDoujinID` and `fetchDoujin`
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

class nhentaiAPIError extends Error {
    response: Record<string, unknown>;
    constructor(response: Record<string, unknown>) {
        super('API returned an error');
        this.response = response;
        this.name = 'nhentaiAPIError';
        Error.captureStackTrace(this, nhentaiAPIError);
    }
}
