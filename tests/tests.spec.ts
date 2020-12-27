import { use as chaiUse, expect } from 'chai';
import * as chai_as_promised from 'chai-as-promised';
import 'mocha';
chaiUse(chai_as_promised);

import { API, SortMethods, nhentaiAPIError } from '../src/index';
import Image from '../src/image';
import SearchResult from '../src/search';

const api = new API();

// does not fucking work, whatever the fuck i'm doing does not work
// both pass even though they shouldnt, i reversed the fucking values
// describe('doujinExists', () => {
//     it('should return false', () => {
//         expect(api.doujinExists(9999999)).to.eventually.be.true;
//     });
//     it('should return true', () => {
//         expect(api.doujinExists(334430)).eventually.to.be.false;
//     });
// });

describe('fetchDoujin', () => {
    it('should return a doujin', () => {
        return expect(api.fetchDoujin(334430)).eventually.be.not.undefined;
    });
    it('should reject if page is not a number', () => {
        return expect(api.fetchDoujin('NaN')).to.be.rejectedWith('DoujinID paramater is not a number.');
    });
    it('should reject if doujin does not exist', () => {
        return expect(api.fetchDoujin(0)).to.eventually.be.undefined;
    });
    it('should reject if doujinID is lower than 0', () => {
        return expect(api.fetchDoujin(-1)).to.be.rejectedWith('DoujinID cannot be lower than 1.');
    });
    it('should return a buffer of the thumbnail', async () => {
        const doujin = await api.fetchDoujin(334430);
        return expect(doujin?.thumbnail.fetch()).to.eventually.be.an.instanceOf(Buffer);
    });
});

describe('fetchHomepage', () => {
    it('should return a search result', () => {
        return expect(api.fetchHomepage()).to.eventually.be.an.instanceOf(SearchResult);
    });
});

describe('search', () => {
    it('should return a search result', async () => {
        const result: SearchResult = await api.search('METAMORPHOSIS');
        return expect(result.doujins[0].pages[0]).to.be.an.instanceOf(Image);
    });
});

describe('searchByTagID', () => {
    it('should return a search result', async () => {
        const result: SearchResult = await api.searchByTagID(8739);
        return expect(result.doujins[0].pages[0]).to.be.an.instanceOf(Image);
    });
    it('should catch an api error', () => {
        return expect(api.searchByTagID(1, 1, 'a')).to.eventually.be.rejectedWith('API returned an error');
    });
});

describe('searchRelated', () => {
    it('should return a search result', async () => {
        const result: SearchResult = await api.searchRelated(334430);
        return expect(result.doujins[0].pages[0]).to.be.an.instanceOf(Image);
    });
});

describe('randomDoujinID', () => {
    it('should return a number', async () => {
        return expect(api.randomDoujinID()).to.eventually.be.a('number');
    });
});

describe('randomDoujin', () => {
    it('should return a Doujin', () => {
        return expect(api.randomDoujin()).to.eventually.be.fulfilled;
    });
});
