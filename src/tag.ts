import { HOST_URL, APITag } from './api';

export default class Tag {
    readonly id: number;
    readonly type: string;
    readonly name: string;
    readonly url: string;
    readonly count: number;

    constructor(tag: APITag) {
        this.id = tag.id;
        this.type = tag.type;
        this.name = tag.name;

        /**
         * Tag URL to view more doujins with this tag
         */
        this.url = HOST_URL + tag.url;

        /**
         * Amount of doujins that have this tag
         */
        this.count = tag.count;
    }
}
