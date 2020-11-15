import { expect } from 'chai';
import 'mocha';

import NHentai from '../src';
import Image from '../src/image';

describe('fetchDoujin', () => {
    it('should return a Book instance', async () => {
        const result: any = await new NHentai().fetchDoujin(177013);
        expect(result.pages[0]).instanceOf(Image);
    });
});

describe('search', () => {
    it('should return a search result instance', async () => {
        const result: any = await new NHentai().search('METAMORPHOSIS');
        expect(result.doujins[0].pages[0]).instanceOf(Image);
    });
});

describe('searchByTagID', () => {
    it('should return a search result instance', async () => {
        const result: any = await new NHentai().searchByTagID(8739);
        expect(result.doujins[0].pages[0]).instanceOf(Image);
    });
});

describe('searchRelated', () => {
    it('should return a search result instance', async () => {
        const result: any = await new NHentai().searchRelated(177013);
        expect(result.doujins[0].pages[0]).instanceOf(Image);
    });
});
