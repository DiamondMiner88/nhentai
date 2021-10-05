import { APICommentAuthor, IMAGE_URL } from '.';

/**
 * An author of a comment on a doujin
 */
export class CommentAuthor {
    /**
     * The ID of this user
     */
    id: number;

    /**
     * Public facing name?
     */
    username: string;

    /**
     * Unserialized name?
     */
    slug: string;

    /**
     * Avatar URL
     */
    avatar: string;

    /**
     * No idea what this is
     */
    isSuperuser: boolean;

    /**
     * nHentai site staff
     */
    isStaff: boolean;

    /**
     * @hidden
     */
    constructor(raw: APICommentAuthor) {
        this.id = raw.id;
        this.username = raw.username;
        this.slug = raw.slug;
        this.avatar = IMAGE_URL + '/' + raw.avatar_url;
        this.isSuperuser = raw.is_superuser;
        this.isStaff = raw.is_staff;
    }
}
