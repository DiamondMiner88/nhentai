import Image from './image';
import Tag from './tag';
import { API, HOST_URL, APIDoujin } from './api';

export default class Doujin {
    /**
     * ID of the doujin. Commonly known as as a '6 digit number'
     */
    readonly id: number;

    /**
     * Media ID, this is not the doujin id
     */
    readonly mediaId: number;

    /**
     * All the titles that the doujin has.
     * @param english Example: (C92) [Rosapersica (Ichinomiya)] Keijun Yahagi wa Koi o Shita. Jou | Light Cruiser Yahagi Fell In Love - First (Kantai Collection -KanColle-) [English] [Spicaworks]
     * @param japanese Example: (C92) [Rosapersica (一ノ宮)] 軽巡矢矧は恋をした。上 (艦隊これくしょん -艦これ-) [英訳]
     * @param pretty Example: Keijun Yahagi wa Koi o Shita. Jou | Light Cruiser Yahagi Fell In Love - First
     */
    readonly titles: {
        english: string;
        japanese: string;
        pretty: string;
    };

    readonly pages: Image[];

    /**
     * Cover image of the doujin
     */
    readonly cover: Image;

    /**
     * Similar to `cover` except this one is lower quality and is shown only while browsing results
     */
    readonly thumbnail: Image;

    /**
     * User url
     */
    readonly url: string;

    /**
     * Scanlator if one exists, otherwise a blank string
     */
    readonly scanlator: string;

    readonly uploadDate: Date;

    readonly length: number;

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

    hasTagByName(name: string): boolean {
        return !!this.tags.find(tag => tag.name === name);
    }

    hasTagByID(ID: number): boolean {
        return !!this.tags.find(tag => tag.id === ID);
    }
}
