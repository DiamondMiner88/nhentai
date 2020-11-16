import { HOST_URL } from './urls';
import { API } from './api';
import Image from './image';
import Tag from './tag';
import * as fs from 'fs';
import * as JSZip from 'jszip';

export default class Doujin {
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

    private readonly apiOptions: any;

    constructor(book: any, apiOptions: any) {
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

        this.apiOptions = apiOptions;
    }

    hasTagByName(name: string) {
        return !!this.tags.find(tag => tag.name === name);
    }
    hasTagByID(ID: number) {
        return !!this.tags.find(tag => tag.id === ID);
    }

    downloadZipped(path: string, options: any = { overwrite: true }) {
        return new Promise((resolve, reject) => {
            if (!options.overwrite && fs.existsSync(path)) return reject(new Error('File already exists.'));

            const zip = new JSZip();
            const doujin = this;

            function recurseDownload(pagesLeft: Image[]) {
                if (pagesLeft.length === 0) {
                    zip.generateAsync({ type: 'nodebuffer' }).then(data => {
                        const stream = fs.createWriteStream(path, { flags: 'w' });
                        stream.write(data);
                        stream.end();
                        resolve();
                    });
                } else {
                    pagesLeft[0].fetchBuffer().then(image => {
                        const fileName = `${pagesLeft[0].pageNumber}.${pagesLeft[0].extension}`;
                        zip.file(fileName, image, { binary: true });

                        /* tslint:disable */
                        if (doujin.apiOptions.isVerbalDownloadEnabled)
                            console.log(`${doujin.doujinId}: Downloaded page ${pagesLeft[0].pageNumber}`);
                        /* tslint:enable */

                        pagesLeft.shift();
                        recurseDownload(pagesLeft);
                    });
                }
            }

            this.cover.fetchBuffer().then(image => zip.file(`cover.${this.cover.extension}`, image, { binary: true }));
            recurseDownload([...this.pages]);

            zip.file(`info.json`, JSON.stringify({ ...this, saved_at: new Date() }, null, 4));
        });
    }
}
