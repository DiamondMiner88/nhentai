import Image from './image';
import Tag from './tag';
import { API, HOST_URL, APIDoujin } from './api';

export default class Doujin {
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
     * Raw response from the API
     */
    readonly raw?: APIDoujin;

    constructor(book: APIDoujin, api: API) {
        this.id = book.id;
        this.mediaId = +book.media_id;
        this.titles = book.title;
        this.scanlator = book.scanlator;
        this.uploadDate = new Date(book.upload_date * 1000);
        this.length = book.num_pages;
        this.favorites = book.num_favorites;
        this.url = `${HOST_URL}/g/${book.id}`;
        this.pages = book.images.pages.map((image, index) => new Image(image, index + 1, this));
        this.cover = new Image(book.images.cover, 'cover', this);
        this.thumbnail = new Image(book.images.thumbnail, 'thumbnail', this);
        this.tags = book.tags.map(tag => new Tag(tag));
        if (api.options.preserveRaw) this.raw = book;
    }

    /**
     * Search doujin if it has a tag.
     * @param name Name of tag.
     * @returns true if doujin contains a matching tag.
     */
    hasTagByName(name: string): boolean {
        return !!this.tags.find(tag => tag.name === name);
    }

    /**
     * Search doujin if it has a tag.
     * @param ID ID of the tag.
     * @returns true if doujin contains a matching tag.
     */
    hasTagByID(ID: number): boolean {
        return !!this.tags.find(tag => tag.id === ID);
    }
}
