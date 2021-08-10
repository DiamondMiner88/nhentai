import { HOST_URL } from "./constants";
import { APITag, APITagType } from './apitypes';

export class Tag {
    readonly id: number;
    readonly type: APITagType;
    readonly name: string;

    /**
     * URL to main site with doujins that have this tag
     */
    readonly url: string;

    /**
     * Times this tag was used on doujins
     */
    readonly count: number;

    /**
     * @hidden
     * @param raw API data
     */
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

export class TagManager {
    /**
     * All parsed tags on the doujin
     */
    readonly all: Tag[];

    /**
     * @hidden
     * @param raw Raw data
     */
    constructor(raw: APITag[]) {
        this.all = raw.map(tag => new Tag(tag));
    }

    /**
     * Find a tag with a certain id
     * @param id Id of the tag
     */
    getById = (id: number): Tag | undefined => this.all.find(tag => tag.id === id);

    /**
     * Get all tags with a certain type
     * @param type Tag type
     */
    getByType = (type: APITagType): Tag[] => this.all.filter(tag => tag.type === type);

    /**
     * All tags with their type being `tag`\
     * If you want all the properties of a doujin such as the languages use the `all` property
     */
    get tags(): Tag[] {
        return this.getByType('tag');
    }

    get groups(): Tag[] {
        return this.getByType('group');
    }

    get languages(): Tag[] {
        return this.getByType('language');
    }

    get artists(): Tag[] {
        return this.getByType('artist');
    }

    get characters(): Tag[] {
        return this.getByType('character');
    }

    get parodies(): Tag[] {
        return this.getByType('parody');
    }

    get categories(): Tag[] {
        return this.getByType('category');
    }
}
