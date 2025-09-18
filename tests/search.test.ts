import { suite, test } from 'mocha';
import { use, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { API, Doujin, SearchResult } from '../src/index.js';

suite('search.ts', () => {
	const lib = new API();
	let search: SearchResult;

	before(async () => {
		const result = await lib.search('azur lane');
		if (!result) throw Error('Search query failed');
		search = result;
	});

	test('SearchResult#doujins', () => {
		return expect(search.doujins[0]).to.be.instanceOf(Doujin);
	});

	test('SearchResult#numPages', () => {
		return expect(search.numPages).to.be.a('number');
	});

	test('SearchResult#doujinsPerPage', () => {
		return expect(search.doujinsPerPage).to.be.a('number');
	});
});
