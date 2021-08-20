import { use as chaiUse, expect, assert } from 'chai';
// TODO: dont use chai as promised
import * as chai_as_promised from 'chai-as-promised';
chaiUse(chai_as_promised);
import { suite, test } from 'mocha';

import { API, Doujin, Image, SearchResult, SortMethods } from '../src/index';

suite('API', () => {
    const lib = new API();

    suite('doujinExists', async () => {
        test('try invalid doujin', async () => {
            const result = await lib.doujinExists(9999999);
            assert(!result);
        });
        test('try valid doujin', async () => {
            const result = await lib.doujinExists(334430);
            assert(result);
        });
    });

    suite('fetchDoujin', () => {
        test('returns a doujin', async () => {
            const result = await lib.fetchDoujin(334430);
            assert(result instanceof Doujin);
        });
        test('rejects when page is not number', () => {
            return expect(lib.fetchDoujin('NaN')).to.be.rejected;
        });
        test('invalid doujin returns null', async () => {
            const result = await lib.fetchDoujin(9999999);
            assert(result === null);
        });
        test('rejects when doujin id is <1', () => {
            return expect(lib.fetchDoujin(-1)).to.be.rejected;
        });
    });

    test('fetchHomepage returns search results', async () => {
        const result = await lib.fetchHomepage();
        assert(result instanceof SearchResult);
    });

    suite('search', () => {
        test('returns search results', async () => {
            const result = await lib.search('METAMORPHOSIS');
            assert(result.doujins[0].pages[0] instanceof Image);
        });

        test('different pages', async () => {
            const result = await lib.search('hololive', { page: 2 });
            assert(result.doujins[0].pages[0] instanceof Image);
        });

        test('different sort method', async () => {
            const result = await lib.search('hololive', { page: 1, sort: SortMethods.POPULAR_ALL_TIME });
            assert(result.doujins[0].pages[0] instanceof Image);
        });
    });

    suite('searchByTagID', () => {
        test('returns search results', async () => {
            const result = await lib.searchByTagID(8739);
            assert(result.doujins[0].pages[0] instanceof Image);
        });
        test('reject when sort method is invalid', () => {
            // @ts-expect-error tests
            return expect(lib.searchByTagID(1, { sort: 'a' })).to.eventually.be.rejected;
        });
    });

    suite('searchRelated', () => {
        test('returns search results', async () => {
            const result = await lib.searchRelated(334430);
            assert(result.doujins[0].pages[0] instanceof Image);
        });
    });

    test('randomDoujinID', async () => {
        const result = await lib.randomDoujinID();
        assert(typeof result === 'number');
    });

    test('randomDoujin', async () => {
        const doujin = await lib.randomDoujin();
        assert(doujin instanceof Doujin);
    });
});

suite('Doujin', () => {
    const imgRegex = /^https:\/\/[ti]\.nhentai\.net\/galleries\/\d{1,7}\/(?:\d{0,4}|thumb|cover)\.(?:gif|jpg|png)$/;
    const lib = new API();

    let doujin: Doujin;

    before(async () => {
        const result = await lib.fetchDoujin(1);
        if (!result) throw Error('Failed to fetch doujin');
        doujin = result;
    });

    test('has pages', () => {
        assert(doujin.pages?.length > 0);
    });

    test('cover has valid url', () => {
        assert(imgRegex.test(doujin.cover.url));
    });

    test('thumbnail has valid url', () => {
        assert(imgRegex.test(doujin.thumbnail.url));
    });

    test('1st page has valid url', () => {
        assert(imgRegex.test(doujin.pages[0].url));
    });

    test('cover pageNumber should be null', () => {
        assert(doujin.cover.pageNumber === null);
    });

    test('thumbnail pageNumber should be null', () => {
        assert(doujin.thumbnail.pageNumber === null);
    });

    test("1st page's pageNumber should be a number", () => {
        assert(typeof doujin.pages[0].pageNumber === 'number');
    });

    test('Doujin#raw', () => {
        assert(!!doujin.raw);
    });
});

suite('Image', () => {
    const lib = new API();

    let doujin: Doujin;

    before(async () => {
        const result = await lib.fetchDoujin(334430);
        if (!result) throw Error('Failed to fetch doujin');
        doujin = result;
    });

    test('fetch data to Buffer', async () => {
        const buffer = await doujin.cover.fetch();
        assert(buffer instanceof Buffer);
    });

    test('has valid extention', () => {
        assert(['png', 'jpg', 'gif'].includes(doujin.cover.extension));
    });

    test('has valid height', () => {
        assert(typeof doujin.cover.height === 'number');
    });

    test('has valid width', () => {
        assert(typeof doujin.cover.width === 'number');
    });
});
