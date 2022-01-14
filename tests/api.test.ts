import { suite, test } from 'mocha';
import { use, expect } from 'chai';
import * as chai_as_promised from 'chai-as-promised';
use(chai_as_promised);

import { API, Comment, Doujin, SearchResult, SortMethods } from '../src/index';

suite('API.ts', () => {
	const lib = new API();
	const blacklistedTagsLib = new API({ blacklistedTags: ['yaoi'] });

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

		test('blacklisted succeeds', () => {
			return expect(blacklistedTagsLib.doujinExists(387481)).to.eventually.be.fulfilled;
		});
	});

	suite('API#fetchDoujin', () => {
		test('control -> Doujin', () => {
			return expect(lib.fetchDoujin(334430)).to.eventually.be.instanceOf(Doujin);
		});

		test('invalid id -> null', () => {
			return expect(lib.fetchDoujin(999999)).to.eventually.be.null;
		});

		test('reject id != number', () => {
			return expect(lib.fetchDoujin('abc')).to.eventually.be.rejected;
		});

		test('reject id <= 1', () => {
			return expect(lib.fetchDoujin(-1)).to.eventually.be.rejected;
		});

		test('blacklisted -> null', () => {
			return expect(blacklistedTagsLib.fetchDoujin(387481)).to.eventually.be.null;
		});
	});

	suite('API#fetchComments', () => {
		test('control -> Comment[]', async () => {
			const result = await lib.fetchComments(334430);
			// Until I figure out a proper way to test arrays, this will do
			// eslint-disable-next-line
			return expect(result![0]).to.be.instanceOf(Comment);
		});

		test('invalid id -> null', () => {
			return expect(lib.fetchComments(999999)).to.eventually.be.null;
		});

		test('reject id != number', () => {
			return expect(lib.fetchComments('abc')).to.eventually.be.rejected;
		});

		test('reject id <= 1', () => {
			return expect(lib.fetchComments(-1)).to.eventually.be.rejected;
		});

		test('blacklisted succeeds', () => {
			return expect(blacklistedTagsLib.fetchComments(387481)).to.eventually.be.fulfilled;
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

		test('blacklisted excluded', async () => {
			const results = await blacklistedTagsLib.search('yuruyakatou');
			return expect(
				results.doujins.some(doujin => doujin.tags.all.some(tag => tag.name == 'yaoi'))
			).to.be.false;
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

		test('blacklisted excluded', async () => {
			const results = await blacklistedTagsLib.searchByTagID(14283);
			return expect(
				results.doujins.some(doujin => doujin.tags.all.some(tag => tag.name == 'yaoi'))
			).to.be.false;
		});
	});

	suite('API#searchRelated', () => {
		test('control -> SearchResult', () => {
			return expect(lib.searchRelated(334430)).to.eventually.be.instanceOf(SearchResult);
		});

		test('reject id != number', () => {
			return expect(lib.searchRelated('abc')).to.eventually.be.rejected;
		});

		test('blacklisted excluded', async () => {
			const results = await blacklistedTagsLib.searchRelated(387481);
			return expect(
				results.doujins.some(doujin => doujin.tags.all.some(tag => tag.name == 'yaoi'))
			).to.be.false;
		});
	});

	test('API#randomDoujinID', () => {
		return expect(lib.randomDoujinID()).to.eventually.be.a('number');
	});

	test('API#randomDoujin', () => {
		return expect(lib.randomDoujin()).to.eventually.be.instanceOf(Doujin);
	});
});
