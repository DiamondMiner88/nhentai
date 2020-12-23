declare module 'nhentai' {
    export const HOST_URL: string;
    export const IMAGE_URL: string;
    export const THUMBS_URL: string;
    export const API_URL: string;

    export enum SortMethods {
        RECENT = '',
        POPULAR_ALL_TIME = 'popular',
        POPULAR_THIS_WEEK = 'popular-week',
        POPULAR_TODAY = 'popular-today'
    }

    export class API {
        options: Record<string, never>;

        constructor(options?: Record<string, never>);

        /**
         * Checks if a doujins exists
         * @param doujinID ID of the doujin
         */
        doujinExists(doujinID: number | string): Promise<boolean>;

        /**
         * Fetch a doujin's info.
         * @param doujinID ID of the doujin to get. Commonly referred to as '6 digit number'.
         */
        fetchDoujin(doujinID: number | string): Promise<Doujin>;

        /**
         * Get the homepage. Alias for `search('*')`
         * @param page Which nhentai page to look on.
         * @param sort How you want to sort the results. If blank sorted by most recently uploaded, otherwise by amount of favorites it with optional limitators like most popular today.
         */
        fetchHomepage(page?: string | number, sort?: string): Promise<SearchResult>

        /**
         * Search nhentai for any doujin that matches the query in any titles.
         * @param query String to match against titles.
         * @param page Which nhentai page to look on.
         * @param sort How you want to sort the results. If blank sorted by most recently uploaded, otherwise by amount of favorites it with optional limitators like most popular today.
         */
        search(query: string, page?: string | number, sort?: SortMethods): Promise<SearchResult>;

        /**
         * Searches nhentai for any doujins that have this tag.
         * @param tagID ID of the tag.
         * @param page Which nhentai page to look on.
         */
        searchByTagID(tagID: number | string, page?: string | number, sort?: SortMethods): Promise<SearchResult>;

        /**
         * Find similar doujins.
         * @param doujinID ID of the doujin.
         * @param page Which nhentai page to look on.
         */
        searchRelated(doujinID: number | string, page?: string | number): Promise<SearchResult>;

        /**
         * Gets a random doujin by using nhentai's `/random` user endpoint which redirects to a doujin and the url is captured.
         */
        randomDoujinID(): Promise<number>;

        /**
         * Gets a random doujin using `randomDoujinID` and `fetchDoujin`
         */
        randomDoujin(): Promise<Doujin>;
    }

    class Doujin {
        /**
         * Doujin ID, most commonly referred to as '6 digit code'.
         */
        readonly id: number;
        /**
         * Media ID, this is different to Doujin ID and I don't know why it exists.
         */
        readonly mediaId: number;
        /**
         * All the titles that the doujin has.
         * @param english Example: [ShindoLA] METAMORPHOSIS (Complete) [English]
         * @param japanese Example: [REN] 夫が寝ている隣で襲われて…～私、あなたの上司にハメられてます～【合冊版】 1巻
         * @param pretty Example: METAMORPHOSIS
         */
        readonly titles: {
            english: string;
            japanese: string;
            pretty: string;
        };
        /**
         * Array of all the pages in order.
         */
        readonly pages: Image[];
        /**
         * Cover image of the doujin.
         */
        readonly cover: Image;
        /**
         * Similar to `cover` except this one is lower quality and is shown on browsing results.
         */
        readonly thumbnail: Image;
        /**
         * Non-API url to the doujin
         */
        readonly url: string;
        /**
         * Scanlator, if one exists. Otherwise just a blank string.
         */
        readonly scanlator: string;
        /**
         * Date when the doujin was upload.
         */
        readonly uploadDate: Date;
        /**
         * Amount of pages in the doujin.
         */
        readonly length: number;
        /**
         * Amount of 'favorites' on the doujin
         */
        readonly favorites: number;
        /**
         * Every single type of tag on the doujin.
         * This includes language, characters, groups, and regular tags.
         */
        readonly tags: Tag[];

        /**
         * Search doujin if it has a tag.
         * @param name Name of tag.
         * @returns true if doujin contains a matching tag.
         */
        hasTagByName(name: string): boolean;

        /**
         * Search doujin if it has a tag.
         * @param ID ID of the tag.
         * @returns true if doujin contains a matching tag.
         */
        hasTagByID(ID: number): boolean;

        /**
         * Download each image from the api individually and bundle to a zip
         * @returns Buffer of zip
         */
        fetchAndZip(): Promise<Buffer>;
    }

    class Image {
        /**
         * File extention of the image
         */
        readonly extension: string;
        readonly height: number;
        readonly width: number;
        readonly url: string;
        readonly page_number: number | null;

        /**
         * Fetches the image
         */
        fetch(): Promise<Buffer>;
    }

    class Tag {
        readonly id: number;
        readonly type: 'tag' | 'category' | 'artist' | 'parody' | 'character' | 'group' | 'language';
        readonly name: string;
        /**
         * Tag URL to view more doujins with this tag
         */
        readonly url: string;
        /**
         * Amount of doujins that have this tag
         */
        readonly count: number;
    }

    class SearchResult {
        /**
         * Doujins that were returned from the search.
         */
        readonly doujins: Doujin[];
        /**
         * Number of pages that the api searched.
         */
        readonly numPages: number;
        /**
         * Number of doujins per page the api used.
         */
        readonly doujinsPerPage: number;
    }
}
