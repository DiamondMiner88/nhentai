import fetch from 'node-fetch';
import Doujin from './doujin';
import { THUMBS_URL, IMAGE_URL, APIImage } from './api';

export default class Image {
    /**
     * File extention of the image
     */
    readonly extension: string;

    readonly height: number;

    readonly width: number;

    readonly url: string;

    readonly page_number: number | null = null;

    constructor(image: APIImage, name: string | number, doujin: Doujin) {
        this.extension = Image.extensionConvert(image.t);
        this.height = image.h;
        this.width = image.w;
        const parsedName = Number(name);
        this.url = `${isNaN(parsedName) ? THUMBS_URL : IMAGE_URL}/galleries/${doujin.mediaId}/${name}.${
            this.extension
        }`;
    }

    /**
     * Fetches the image
     */
    fetch(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fetch(this.url)
                .then(data => data.buffer())
                .then(data => resolve(data))
                .catch(error => reject(error));
        });
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
                throw new Error(`Image extension "${extension}" is not a known format.`);
        }
    }
}
