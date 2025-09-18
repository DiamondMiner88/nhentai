import { Doujin } from './doujin.js';
import { THUMBS_URL, IMAGE_URL } from './constants.js';
import { APIImage } from './apitypes.js';

export class Image {
	/**
	 * File extension
	 */
	readonly extension: 'png' | 'gif' | 'jpg' | 'webp';

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
	readonly pageNumber: number | null = null;

	/**
	 * @hidden
	 * @param raw Raw data
	 * @param name Page number/thumbnail/cover
	 * @param doujin Parent doujin
	 */
	constructor(raw: APIImage, name: string | number, doujin: Doujin) {
		this.extension = Image.extensionConvert(raw.t);
		this.height = raw.h;
		this.width = raw.w;
		this.pageNumber = isNaN(name as number) ? null : Number(name);
		const baseURL = isNaN(name as number) ? THUMBS_URL : IMAGE_URL;
		this.url = `${baseURL}/galleries/${doujin.mediaId}/${name}.${this.extension}`;
	}

	/**
	 * Fetches the image
	 */
	async fetch(): Promise<ArrayBuffer> {
		return fetch(this.url).then(data => data.arrayBuffer());
	}

	/**
	 * Converts an images `t` paramater to a file extension
	 * @hidden
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
			case 'w':
				return 'webp';
			default:
				throw new Error(`Image extension "${extension}" is not a known format.`);
		}
	}
}
