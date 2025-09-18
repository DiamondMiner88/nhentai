import { APIComment } from './apitypes.js';
import { CommentAuthor } from './commentAuthor.js';

/**
 * A single comment on a doujin
 */
export class Comment {
	/**
	 * Comment ID
	 */
	readonly id: number;

	/**
	 * ID of the doujin this comment belongs to
	 */
	readonly doujinID: number;

	/**
	 * This comment's author
	 */
	readonly author: CommentAuthor;

	/**
	 * Time when this comment was posted
	 */
	readonly createdAt: Date;

	/**
	 * UNIX timestamp (seconds) of when the comment was posted
	 */
	readonly createdAtTimestamp: number;

	/**
	 * The comment's body. Remember these are not sanitized properly and can have odd characters that break webpages, no XSS presumably though.
	 */
	readonly content: string;

	/**
	 * @hidden
	 */
	constructor(raw: APIComment) {
		this.id = raw.id;
		this.doujinID = raw.gallery_id;
		this.author = new CommentAuthor(raw.poster);
		this.createdAt = new Date(raw.post_date * 1000);
		this.createdAtTimestamp = raw.post_date;
		this.content = raw.body;
	}
}
