import fetch from 'node-fetch';
import { Doujin } from './doujin';
import { THUMBS_URL, IMAGE_URL } from './api';
import { APIImage } from './apitypes';

export class Image {
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
     * Page number or null when this is a thumbnail/cover.
     */
    readonly page_number: number | null = null;

    /**
     * Internal constructor. Use only if you know what you are doing.
     * @param raw Raw data
     * @param name Indicates page number or thumbnail / cover
     * @param doujin Parent doujin instance
     */
    constructor(raw: APIImage, name: string | number, doujin: Doujin) {
        this.extension = Image.extensionConvert(raw.t);
        this.height = raw.h;
        this.width = raw.w;
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
     * Converts an images `t` paramater to a file extension
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
