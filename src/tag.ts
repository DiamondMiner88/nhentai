import { HOST_URL, APITag } from './api';

export default class Tag {
    readonly id: number;
    readonly type: string;
    readonly name: string;
    readonly url: string;
    readonly count: number;

    constructor(raw: APITag) {
        this.id = raw.id;
        this.type = raw.type;
        this.name = raw.name;

        /**
         * Tag URL to view more doujins with this tag
         */
        this.url = HOST_URL + raw.url;

        /**
         * Amount of doujins that have this tag
         */
        this.count = raw.count;
    }
}
