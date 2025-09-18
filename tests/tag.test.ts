import { suite, test } from 'mocha';
import { use, expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
use(chaiAsPromised);

import { API, Doujin, Tag, TagManager } from '../src/index.js';

const tagTypes = ['tag', 'group', 'language', 'artist', 'character', 'parody', 'category'];

suite('tag.ts', () => {
	const lib = new API();
	let doujin: Doujin;

	before(async () => {
		const result = await lib.fetchDoujin(334430);
		if (!result) throw Error('Failed to fetch doujin');
		doujin = result;
	});

	suite('Tag', () => {
		let tag: Tag;

		before(() => {
			tag = doujin.tags.all[0];
		});

		test('Tag#id', () => {
			return expect(tag.id).to.be.a('number');
		});

		test('Tag#type', () => {
			return expect(tag.type).to.be.oneOf(tagTypes);
		});

		test('Tag#name', () => {
			return expect(tag.name).to.be.a('string');
		});

		test('Tag#url', () => {
			return expect(tag.url).to.match(/https:\/\/nhentai\.net\//);
		});

		test('Tag#count', () => {
			return expect(tag.count).to.be.a('number');
		});
	});

	suite('TagManager', () => {
		let manager: TagManager;

		before(() => {
			manager = doujin.tags;
		});

		test('TagManager#all', () => {
			return expect(manager.all[0]).to.be.instanceOf(Tag);
		});

		test('TagManager#groups', () => {
			return expect(manager.groups[0]).to.be.instanceOf(Tag);
		});

		test('TagManager#tags', () => {
			return expect(manager.tags[0]).to.be.instanceOf(Tag);
		});

		test('TagManager#languages', () => {
			return expect(manager.languages[0]).to.be.instanceOf(Tag);
		});

		test('TagManager#artists', () => {
			return expect(manager.artists[0]).to.be.instanceOf(Tag);
		});

		test('TagManager#characters', () => {
			return expect(manager.characters[0]).to.be.instanceOf(Tag);
		});

		test('TagManager#parodies', () => {
			return expect(manager.parodies[0]).to.be.instanceOf(Tag);
		});

		test('TagManager#categories', () => {
			return expect(manager.categories[0]).to.be.instanceOf(Tag);
		});

		test('TagManager#getById', () => {
			return expect(manager.getById(12227)?.name).to.equal('english');
		});

		test('TagManager#getByTag', () => {
			const expectedTags = [
				'multi-work series',
				'stockings',
				'sole female',
				'sole male',
				'ponytail',
				'gloves'
			];
			return expect(manager.getByType('tag').map(t => t.name)).to.include.members(
				expectedTags
			);
		});
	});
});
