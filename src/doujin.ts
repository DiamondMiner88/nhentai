import { Image } from './image';
import { TagManager } from './tag';
import { HOST_URL } from './constants';
import { APIDoujin } from './apitypes';

export class Doujin {
    readonly id: number;

    /**
     * Media ID, this is **NOT** the same as the doujin id
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
     * Low resolution cover
     */
    readonly thumbnail: Image;

    /**
     * Content url
     */
    readonly url: string;

    /**
     * Scanlator if exists
     */
    readonly scanlator: string | null;

    /**
     * The time it was published to the site
     */
    readonly uploadDate: Date;

    /**
     * The timestamp of when it was published to the site
     */
    readonly uploadTimestamp: number;

    /**
     * Page count
     */
    readonly length: number;

    readonly favorites: number;

    readonly tags: TagManager;

    /**
     * Raw data from the API
     */
    readonly raw: APIDoujin;

    /**
     * @hidden
     * @param raw API data
     */
    constructor(raw: APIDoujin) {
        this.raw = raw;
        this.id = raw.id;
        this.mediaId = Number(raw.media_id);
        this.titles = raw.title;
        this.scanlator = raw.scanlator.length > 0 ? raw.scanlator : null;
        this.uploadDate = new Date(raw.upload_date * 1000);
        this.uploadTimestamp = raw.upload_date;
        this.length = raw.num_pages;
        this.favorites = raw.num_favorites;
        this.url = `${HOST_URL}/g/${raw.id}`;
        this.pages = raw.images.pages.map((image, index) => new Image(image, index + 1, this));
        this.cover = new Image(raw.images.cover, 'cover', this);
        this.thumbnail = new Image(raw.images.thumbnail, 'thumb', this);
        this.tags = new TagManager(raw.tags);
    }

    hasTagByName(name: string): boolean {
        return !!this.tags.all.find(tag => tag.name === name);
    }

    hasTagByID(ID: number): boolean {
        return !!this.tags.all.find(tag => tag.id === ID);
    }
}
