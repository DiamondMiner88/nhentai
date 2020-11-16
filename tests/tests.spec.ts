import { use as chaiUse, expect } from 'chai';
import * as chai_as_promised from 'chai-as-promised';
import 'mocha';
chaiUse(chai_as_promised);

import { API } from '../src/index';
import Image from '../src/image';
import Doujin from '../src/Doujin';
const api = new API();

describe('fetchDoujin', () => {
    it('should return a doujin', async () => {
        const result: any = await api.fetchDoujin(334430);
        return expect(result.pages[0]).instanceOf(Image);
    });
    it('should reject if page is not a number', () => {
        return expect(api.fetchDoujin('NaN')).to.be.rejectedWith('DoujinID paramater is not a number.');
    });
    it('should reject if doujin does not exist', () => {
        return expect(api.fetchDoujin(0)).to.be.rejectedWith('Doujin does not exist.');
    });
    it('should reject if doujinID is lower than 0', () => {
        return expect(api.fetchDoujin(-1)).to.be.rejectedWith('DoujinID cannot be lower than 1.');
    });
});

describe('search', () => {
    it('should return a search result', async () => {
        const result: any = await api.search('METAMORPHOSIS');
        return expect(result.doujins[0].pages[0]).instanceOf(Image);
    });
});

describe('searchByTagID', () => {
    it('should return a search result', async () => {
        const result: any = await api.searchByTagID(8739);
        return expect(result.doujins[0].pages[0]).instanceOf(Image);
    });
});

describe('searchRelated', () => {
    it('should return a search result', async () => {
        const result: any = await api.searchRelated(334430);
        return expect(result.doujins[0].pages[0]).instanceOf(Image);
    });
});

describe('randomDoujinID', () => {
    it('should return a number', async () => {
        return expect(api.randomDoujinID()).to.eventually.be.a('number');
    });
});

// describe('randomDoujin', () => {
//     it('should return a Doujin', () => {
//         return expect(api.randomDoujin()).to.eventually.be.instanceOf(Doujin);
//     });
// });
