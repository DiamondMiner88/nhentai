import { HOST_URL } from './index';
import Image from './image';
import Tag from './tag';

export default class Book {
    readonly doujinId: number;
    readonly mediaId: number;
    readonly titles: {
        english: string;
        japanese: string;
        pretty: string;
    };
    readonly pages: Image[];
    readonly cover: Image;
    readonly thumbnail: Image;
    readonly url: string;
    readonly scanlator: string;
    readonly uploadDate: Date;
    readonly length: number;
    readonly favorites: number;
    readonly tags: Tag[];

    constructor(book: any) {
        this.doujinId = book.id;
        this.mediaId = +book.media_id;
        this.titles = book.title;
        this.scanlator = book.scanlator;
        this.uploadDate = new Date(book.upload_date * 1000);
        this.length = book.num_pages;
        this.favorites = book.num_favorites;

        this.url = `${HOST_URL}/g/${book.id}`;

        this.pages = book.images.pages.map(
            (i: object, pageNum: number) => new Image({ ...i, page_number: pageNum + 1 }, this.mediaId, 'page'),
        );
        this.cover = new Image(book.images.cover, this.mediaId, 'cover');
        this.thumbnail = new Image(book.images.thumbnail, this.mediaId, 'thumbnail');

        this.tags = book.tags.map((tag: any) => new Tag(tag));
    }

    hasTagByName(name: string) {
        return !!this.tags.find(tag => tag.name === name);
    }
    hasTagByID(ID: number) {
        return !!this.tags.find(tag => tag.id === ID);
    }
}
