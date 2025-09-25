import { suite, test } from 'mocha';
import { expect } from 'chai';

import * as nhentai from '../src/index.js';

suite('index.ts', () => {
	test('exports', () => {
		return expect(nhentai).to.have.keys(
			'SortMethods',
			'HOST_URL',
			'IMAGE_URL',
			'THUMBS_URL',
			'API_URL',
			'API',
			'nhentaiAPIError',
			'FlareSolverrError',
			'Comment',
			'CommentAuthor',
			'Doujin',
			'Image',
			'SearchResult',
			'Tag',
			'TagManager'
		);
	});

	// istanbul wyd????
	test('HOST_URL', () => {
		return expect(nhentai.HOST_URL).to.be.a('string');
	});

	test('IMAGE_URL', () => {
		return expect(nhentai.IMAGE_URL).to.be.a('string');
	});

	test('THUMBS_URL', () => {
		return expect(nhentai.THUMBS_URL).to.be.a('string');
	});

	test('API_URL', () => {
		return expect(nhentai.API_URL).to.be.a('string');
	});
});
