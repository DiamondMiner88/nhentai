import fetch from 'node-fetch';
import Book from './book';
import SearchResult from './search';

export const HOST_URL = 'https://nhentai.net';
export const IMAGE_URL = 'https://i.nhentai.net';
export const THUMBNAIL_URL = 'https://t.nhentai.net';
export const API_URL = HOST_URL + '/api';

export default class NHentai {
    fetchDoujin(doujinID: number | string) {
        return new Promise((resolve, reject) => {
            if (isNaN(+doujinID)) return null;

            fetch(`${API_URL}/gallery/${doujinID}`)
                .then(data => data.json())
                .then(data => {
                    if (data.error) {
                        if (data.error === 'does not exist') reject(new Error(`${doujinID} does not exist.`));
                        else reject(new Error(data.error));
                    } else resolve(new Book(data));
                })
                .catch(error => reject(error));
        });
    }

    search(query: string, page: string | number = 1, sort: string = '') {
        return new Promise((resolve, reject) => {
            if (isNaN(+page)) return null;

            fetch(`${API_URL}/galleries/search?query=${query}&page=${page}${!!sort ? `&sort=${sort}` : ''}`)
                .then(data => data.json())
                .then(data => resolve(new SearchResult(data)))
                .catch(error => reject(error));
        });
    }

    searchByTagID(tagID: number | string, page: string | number = 1) {
        return new Promise((resolve, reject) => {
            if (isNaN(+tagID) || isNaN(+page)) return null;

            fetch(`${API_URL}/galleries/tagged?tag_id=${tagID}&page=${page}`)
                .then(data => data.json())
                .then(data => resolve(new SearchResult(data)))
                .catch(error => reject(error));
        });
    }

    searchRelated(doujinID: number | string, page: string | number = 1) {
        return new Promise((resolve, reject) => {
            if (isNaN(+doujinID) || isNaN(+page)) return null;

            fetch(`${API_URL}/gallery/${doujinID}/related`)
                .then(data => data.json())
                .then(data => resolve(new SearchResult(data)))
                .catch(error => reject(error));
        });
    }
}
