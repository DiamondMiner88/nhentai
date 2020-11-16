import { THUMBNAIL_URL, IMAGE_URL } from './urls';
import fetch from 'node-fetch';
import * as fs from 'fs';
import { join } from 'path';

export default class Image {
    readonly extension: string;
    readonly height: number;
    readonly width: number;
    readonly url: string;
    readonly type: 'page' | 'thumbnail' | 'cover';
    readonly pageNumber: number;

    constructor(image: any, mediaId: number | string, type: 'page' | 'thumbnail' | 'cover') {
        this.extension = Image.extensionConvert(image.t);
        this.height = image.h;
        this.width = image.w;
        this.type = type;
        this.pageNumber = image.page_number;
        const fileName = type !== 'page' ? (type !== 'thumbnail' ? 'cover' : 'thumb') : image.page_number;
        this.url = `${type === 'page' ? IMAGE_URL : THUMBNAIL_URL}/galleries/${mediaId}/${fileName}.${this.extension}`;
    }

    private static extensionConvert(extension: string) {
        switch (extension) {
            case 'p':
                return 'png';
            case 'j':
                return 'jpg';
            case 'g':
                return 'gif';
            default:
                throw new Error(`Extension ${extension} is not a known format. Contact the author of this package.`);
        }
    }

    fetchBuffer(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fetch(this.url)
                .then(data => data.buffer())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
    }

    download(targetDir: string, filename: string, options: any = { overwrite: true }) {
        return new Promise((resolve, reject) => {
            const path = join(targetDir, filename + '.' + this.extension);
            if (!options.overwrite && fs.existsSync(path)) return reject(new Error('File already exists.'));
            fs.mkdirSync(targetDir, { recursive: true });

            this.fetchBuffer()
                .then(buffer => {
                    const stream = fs.createWriteStream(path, { flags: 'w' });
                    stream.write(buffer);
                    stream.end();
                    resolve();
                })
                .catch(error => reject(error));
        });
    }
}
