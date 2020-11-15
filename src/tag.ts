import { HOST_URL } from './urls';

export default class Tag {
    readonly id: number;
    readonly type: string;
    readonly name: string;
    readonly url: string;
    readonly count: number;

    constructor(tag: any) {
        this.id = tag.id;
        this.type = tag.type;
        this.name = tag.name;
        this.url = HOST_URL + tag.url;
        this.count = tag.count;
    }
}
