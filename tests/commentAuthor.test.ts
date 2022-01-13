import { suite, test } from 'mocha';
import { expect } from 'chai';

import { API } from '../src/index';
import { CommentAuthor } from '../src/commentAuthor';

suite('commentAuthor.ts', () => {
	const lib = new API();
	let author: CommentAuthor;

	before(async () => {
		const result = await lib.fetchComments(334430);
		if (!result) throw Error('Failed to fetch comments');
		author = result[0].author;
	});

	test('CommentAuthor#id', () => {
		return expect(author.id).to.be.a('number');
	});

	test('CommentAuthor#username', () => {
		return expect(author.username).to.be.a('string');
	});

	test('CommentAuthor#slug', () => {
		return expect(author.slug).to.be.a('string');
	});

	test('CommentAuthor#avatar', () => {
		return expect(author.avatar).to.match(/https:\/\/i\.nhentai\.net\/avatars\//);
	});

	test('CommentAuthor#isSuperuser', () => {
		return expect(author.isSuperuser).to.be.a('boolean');
	});

	test('CommentAuthor#isStaff', () => {
		return expect(author.isStaff).to.be.a('boolean');
	});
});
