import { use as chaiUse, expect } from 'chai';
import * as chai_as_promised from 'chai-as-promised';
import 'mocha';
chaiUse(chai_as_promised);

import { API, Image, SearchResult } from '../src/index';
const api = new API();

describe('doujinExists', () => {
    it("return false when doujin doesn't exist", () => {
        return expect(api.doujinExists(9999999)).to.eventually.be.false;
    });
    it('return true when doujin exists', () => {
        return expect(api.doujinExists(334430)).eventually.to.be.true;
    });
});

describe('fetchDoujin', () => {
    it('returns a doujin', () => {
        return expect(api.fetchDoujin(334430)).eventually.be.not.undefined;
    });
    it('rejects when page is not number', () => {
        return expect(api.fetchDoujin('NaN')).to.be.rejected;
    });
    it('non-existing doujin fetch returns undefined', () => {
        return expect(api.fetchDoujin(9999999)).to.eventually.be.undefined;
    });
    it('rejects when doujin id is <1', () => {
        return expect(api.fetchDoujin(-1)).to.be.rejected;
    });
    it('return thumb image buffer', async () => {
        const doujin = await api.fetchDoujin(334430);
        return expect(doujin?.thumbnail.fetch()).to.eventually.be.an.instanceOf(Buffer);
    });
});

describe('fetchHomepage', () => {
    it('returns search results', () => {
        return expect(api.fetchHomepage()).to.eventually.be.an.instanceOf(SearchResult);
    });
});

describe('search', () => {
    it('returns search results', async () => {
        const result = await api.search('METAMORPHOSIS');
        return expect(result.doujins[0].pages[0]).to.be.an.instanceOf(Image);
    });
});

describe('searchByTagID', () => {
    it('returns search results', async () => {
        const result = await api.searchByTagID(8739);
        return expect(result.doujins[0].pages[0]).to.be.an.instanceOf(Image);
    });
    it('reject when sort method is invalid', () => {
        // @ts-expect-error tests
        return expect(api.searchByTagID(1, 1, 'a')).to.eventually.be.rejected;
    });
});

describe('searchRelated', () => {
    it('returns search results', () => {
        return expect(api.searchRelated(334430)).to.eventually.be.an.instanceOf(SearchResult);
    });
});

describe('randomDoujinID', () => {
    it('returns a doujin id', () => {
        return expect(api.randomDoujinID()).to.eventually.be.a('number');
    });
});

describe('randomDoujin', () => {
    it('returns a doujin', () => {
        return expect(api.randomDoujin()).to.eventually.be.fulfilled;
    });
});
