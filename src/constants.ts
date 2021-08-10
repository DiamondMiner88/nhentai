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
export const SortValues = Object.values(SortMethods);

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
