import { suite, test } from 'mocha';
import { use, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { API, Image } from '../src/index.js';

const imgURLRegex =
	/^https:\/\/[ti]\.nhentai\.net\/galleries\/\d{1,7}\/(?:\d{0,4}|thumb|cover)\.(?:gif|jpg|png)$/;
const extensions = ['png', 'jpg', 'gif'];

suite('Image', () => {
	const lib = new API();

	let image: Image;

	before(async () => {
		const doujin = await lib.fetchDoujin(334430);
		if (!doujin) throw Error('Failed to fetch doujin');
		image = doujin.pages[0];
	});

	test('Image#extension is valid', () => {
		return expect(image.extension).to.be.oneOf(extensions);
	});

	test('Image#height', () => {
		return expect(image.height).to.be.a('number');
	});

	test('Image#width', () => {
		return expect(image.width).to.be.a('number');
	});

	test('Image#url', () => {
		return expect(image.url).to.match(imgURLRegex);
	});

	test('Image#pageNumber', () => {
		return expect(image.pageNumber).to.equal(1);
	});

	test('Image#fetch -> ArrayBuffer', () => {
		return expect(image.fetch()).to.eventually.be.instanceOf(ArrayBuffer);
	});

	suite('extensionConvert', () => {
		// @ts-expect-error tests
		test('png', () => expect(Image.extensionConvert('p')).to.equal('png'));

		// @ts-expect-error tests
		test('jpg', () => expect(Image.extensionConvert('j')).to.equal('jpg'));

		// @ts-expect-error tests
		test('gif', () => expect(Image.extensionConvert('g')).to.equal('gif'));

		// FIXME: .throw() has no effect
		// // @ts-expect-error tests
		// test('other', () => expect(Image.extensionConvert('abc')).to.throw());
	});
});
