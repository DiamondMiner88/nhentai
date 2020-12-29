import fetch from 'node-fetch';
import Doujin from './doujin';
import { THUMBS_URL, IMAGE_URL, APIImage } from './api';

export default class Image {
    /**
     * File extension
     */
    readonly extension: string;

    /**
     * Height in pixels
     */
    readonly height: number;

    /**
     * Width in pixels
     */
    readonly width: number;

    /**
     * Full image url
     */
    readonly url: string;

    /**
     * Page number if this is a page. If it is not, then its null and either a cover or thumbnail
     */
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

    /**
     * Converts an images `t` paramater to a file extension\
     * Only 3 are known so far
     * @param extension Raw type from the api
     */
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
