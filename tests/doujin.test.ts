import { suite, test } from 'mocha';
import { use, expect } from 'chai';
import * as chai_as_promised from 'chai-as-promised';
use(chai_as_promised);

import { API, Image, Doujin, TagManager } from '../src/index';

suite('Doujin', () => {
    const lib = new API();

    let doujin: Doujin;

    before(async () => {
        const result = await lib.fetchDoujin(334430);
        if (!result) throw Error('Failed to fetch doujin');
        doujin = result;
    });

    test('Doujin#id', () => {
        return expect(doujin.id).to.be.a('number');
    });

    test('Doujin#mediaId', () => {
        return expect(doujin.mediaId).to.be.a('number');
    });

    test('Doujin#titles', () => {
        return expect(doujin.titles.english).to.be.a('string');
    });

    test('Doujin#pages', () => {
        return expect(doujin.pages[0]).to.be.instanceOf(Image);
    });

    test('Doujin#cover', () => {
        return expect(doujin.cover).to.be.instanceOf(Image);
    });

    test('Doujin#cover#pageNumber == null', () => {
        return expect(doujin.cover.pageNumber).to.be.null;
    });

    test('Doujin#thumbnail', () => {
        return expect(doujin.thumbnail).to.be.instanceOf(Image);
    });

    test('Doujin#thumbnail#pageNumber == null', () => {
        return expect(doujin.thumbnail.pageNumber).to.be.null;
    });

    test('Doujin#url', () => {
        return expect(doujin.url).to.match(/https:\/\/nhentai\.net\/g\/\d{1,6}/);
    });

    test('Doujin#scanlator', () => {
        // This one will always be null however tests other situations as well
        return expect(doujin.scanlator).to.be.null;
    });

    // TODO: find doujin with a scanlator for test coverage

    test('Doujin#uploadDate', () => {
        return expect(doujin.uploadDate.getTime() / 1000).to.equal(doujin.uploadTimestamp);
    });

    test('Doujin#uploadTimestamp', () => {
        return expect(doujin.uploadTimestamp).to.be.a('number');
    });

    test('Doujin#length', () => {
        return expect(doujin.length).to.equal(doujin.pages.length);
    });

    test('Doujin#favorites', () => {
        return expect(doujin.favorites).to.be.a('number');
    });

    test('Doujin#tags', () => {
        return expect(doujin.tags).to.be.instanceOf(TagManager);
    });

    test('Doujin#raw', () => {
        return expect(doujin.raw).to.be.an('object');
    });

    test('Doujin#hasTagByName', () => {
        return expect(doujin.hasTagByName('english')).to.be.true;
    });

    test('Doujin#hasTagByID', () => {
        return expect(doujin.hasTagByID(12227)).to.be.true;
    });
});
