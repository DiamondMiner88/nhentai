import { THUMBNAIL_URL, IMAGE_URL } from './urls';

export default class Image {
    readonly extension: string;
    readonly height: number;
    readonly width: number;
    readonly url: string;
    readonly type: 'page' | 'thumbnail' | 'cover';

    constructor(image: any, mediaId: number | string, type: 'page' | 'thumbnail' | 'cover') {
        this.extension = Image.extensionConvert(image.t);
        this.height = image.h;
        this.width = image.w;
        this.type = type;
        const fileName = type !== 'page' ? (type !== 'thumbnail' ? 'cover' : 'thumb') : image.page_number;
        this.url = `${type === 'page' ? IMAGE_URL : THUMBNAIL_URL}/galleries/${mediaId}/${fileName}.${this.extension}`;
    }

    private static extensionConvert(extension: string) {
        switch (extension) {
            case 'p':
                return 'png';
            case 'j':
                return 'jpg';
            default:
                return 'jpg';
        }
    }
}
