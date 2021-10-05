import { suite, test } from 'mocha';
import { expect } from 'chai';

import { API, Comment, CommentAuthor } from '../src/index';

suite('comment.ts', () => {
    const lib = new API();
    let comment: Comment;

    before(async () => {
        const result = await lib.fetchComments(334430);
        if (!result) throw Error('Failed to fetch comments');
        comment = result[0];
    });

    test('Comment#id', () => {
        return expect(comment.id).to.be.a('number');
    });

    test('Comment#author', () => {
        return expect(comment.author).to.be.instanceOf(CommentAuthor);
    });

    test('Comment#createdAt', () => {
        return expect(comment.createdAt.getTime() / 1000).to.equal(comment.createdAtTimestamp);
    });

    test('Comment#createdAtTimestamp', () => {
        return expect(comment.createdAtTimestamp).to.be.a('number');
    });

    test('Comment#content', () => {
        return expect(comment.content).to.be.a('string').and.length.greaterThan(0);
    });
});
