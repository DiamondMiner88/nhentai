import { suite, test } from 'mocha';
import { use, expect } from 'chai';
import * as chai_as_promised from 'chai-as-promised';
use(chai_as_promised);

import { API, SortMethods, Doujin, SearchResult } from '../src/index';

suite('API.ts', () => {
    const lib = new API();

    suite('API#doujinExists', () => {
        test('control -> true', () => {
            return expect(lib.doujinExists(334430)).to.eventually.be.true;
        });

        test('invalid id -> false', () => {
            return expect(lib.doujinExists(999999)).to.eventually.be.false;
        });

        test('reject id != number', () => {
            return expect(lib.doujinExists('abc')).to.eventually.be.rejected;
        });

        test('reject page <= 1', () => {
            return expect(lib.doujinExists(-1)).to.eventually.be.rejected;
        });
    });

    suite('API#fetchDoujin', () => {
        test('control -> Doujin', () => {
            return expect(lib.fetchDoujin(334430)).to.eventually.be.instanceOf(Doujin);
        });

        test('invalid id -> null', () => {
            return expect(lib.fetchDoujin(999999)).to.eventually.be.null;
        });

        test('reject page != number', () => {
            return expect(lib.fetchDoujin('abc')).to.eventually.be.rejected;
        });

        test('reject page <= 1', () => {
            return expect(lib.fetchDoujin(-1)).to.eventually.be.rejected;
        });
    });

    test('API#fetchHomepage', () => {
        return expect(lib.fetchHomepage()).to.eventually.be.instanceOf(SearchResult);
    });

    suite('API#search', () => {
        test('control -> SearchResult', () =>
            expect(lib.search('azur lane')).to.eventually.be.instanceOf(SearchResult));

        test('reject pages != number', () => {
            // @ts-expect-error tests
            return expect(lib.search('azur lane', { page: 'abc' })).to.eventually.be.rejected;
        });

        test('different pages -> SearchResult', () =>
            expect(lib.search('azur lane', { page: 2 })).to.eventually.be.instanceOf(SearchResult));

        test('reject invalid SortMethod', () => {
            // @ts-expect-error tests
            return expect(lib.search('azur lane', { sort: 'a' })).to.eventually.be.rejected;
        });

        test('different SortMethod', () => {
            return expect(
                lib.search('azur lane', {
                    sort: SortMethods.POPULAR_ALL_TIME
                })
            ).to.eventually.be.instanceOf(SearchResult);
        });

        test('languages', () => {
            return expect(lib.search('azur lane', { language: 'english' }));
        });
    });

    suite('API#searchByTagID', () => {
        test('control -> SearchResult', () => {
            return expect(lib.searchByTagID(8739)).to.eventually.be.instanceOf(SearchResult);
        });

        test('reject id != number', () => {
            // @ts-expect-error tests
            return expect(lib.searchByTagID('abc')).to.eventually.be.rejected;
        });

        test('reject pages != number', () => {
            // @ts-expect-error tests
            return expect(lib.searchByTagID(1, { page: 'abc' })).to.eventually.be.rejected;
        });

        test('reject invalid SortMethod', () => {
            // @ts-expect-error tests
            return expect(lib.searchByTagID(1, { sort: 'a' })).to.eventually.be.rejected;
        });

        test('different SortMethod', () => {
            return expect(
                lib.searchByTagID(1, {
                    sort: SortMethods.POPULAR_ALL_TIME
                })
            ).to.eventually.be.instanceOf(SearchResult);
        });
    });

    suite('API#searchRelated', () => {
        test('control -> SearchResult', () => {
            return expect(lib.searchRelated(334430)).to.eventually.be.instanceOf(SearchResult);
        });

        test('reject id != number', () => {
            return expect(lib.searchRelated('abc')).to.eventually.be.rejected;
        });
    });

    test('API#randomDoujinID', () => {
        return expect(lib.randomDoujinID()).to.eventually.be.a('number');
    });

    test('API#randomDoujin', () => {
        return expect(lib.randomDoujin()).to.eventually.be.instanceOf(Doujin);
    });
});
