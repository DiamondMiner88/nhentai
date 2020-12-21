import Image from './image';
import Tag from './tag';
import * as JSZip from 'jszip';
import { HOST_URL } from './api';
import { APIDoujin } from './apitypes';

export default class Doujin {
    readonly id: number;
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

    constructor(book: APIDoujin) {
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
    }

    hasTagByName(name: string): boolean {
        return !!this.tags.find(tag => tag.name === name);
    }
    hasTagByID(ID: number): boolean {
        return !!this.tags.find(tag => tag.id === ID);
    }

    fetchAndZip(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const zip = new JSZip();

            function recurseDownload(pagesLeft: Image[]) {
                if (pagesLeft.length === 0) zip.generateAsync({ type: 'nodebuffer' }).then(data => resolve(data));
                else {
                    pagesLeft[0]
                        .fetch()
                        .then(image => {
                            const fileName = `${pagesLeft[0].page_number}.${pagesLeft[0].extension}`;
                            zip.file(fileName, image, { binary: true });

                            pagesLeft.shift();
                            recurseDownload(pagesLeft);
                        })
                        .catch(error => reject(error));
                }
            }

            this.cover
                .fetch()
                .then(image => zip.file(`cover.${this.cover.extension}`, image, { binary: true }))
                .catch(error => reject(error));
            recurseDownload([...this.pages]);

            zip.file(`info.json`, JSON.stringify({ ...this, saved_at: new Date() }, null, 4));
        });
    }
}
