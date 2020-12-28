import fetch from 'node-fetch';
import Doujin from './doujin';
import SearchResult from './search';

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

    constructor(options = { preserveRaw: false }) {
        this.options = options;
    }

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

    fetchHomepage(page: string | number = 1, sort = ''): Promise<SearchResult> {
        return this.search('*', page, sort);
    }

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
