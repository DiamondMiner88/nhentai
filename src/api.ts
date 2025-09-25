import { API_URL, HOST_URL, SortMethods, SortValues } from './constants.js';
import { APIComment, APIDoujin, APISearchResult } from './apitypes.js';
import { Comment } from './comment.js';
import { Doujin } from './doujin.js';
import { SearchResult } from './search.js';

/**
 * Search options for `fetchHomepage`/`search`/`searchByTagID`
 */
export interface APISearchOptions {
	page?: number;
	sort?: SortMethods;
	language?: 'english' | 'japanese' | 'chinese';
}

/**
 * Library options for the {@linkcode API}.
 */
export interface APIOptions {
	/**
	 * Blacklist doujins with tags from returning data.
	 * For example, fetching a yaoi doujin with the `yaoi` tag blacklisted will return nothing.
	 * Will also be excluded from search results.
	 */
	blacklistedTags?: string[];

	/**
	 * FlareSolverr-compatible API url. If specified, API requests are proxied through FlareSolverr
	 * in order to bypass Cloudflare challenges, most commonly seen on search requests.
	 *
	 * This requires the `htmlparser2` optional dependency of this package.
	 *
	 * Example: `http://localhost:8081/v1`
	 */
	flaresolverrUrl?: string;
}

/**
 * Interface for interacting with the nhentai API
 */
export class API {
	/**
	 * Construct a new API wrapper
	 * @param options Library options
	 */
	constructor(public options: APIOptions = {}) {}

	/**
	 * Internal wrapper to handle directly fetching the nhentai API as well as fetching
	 * through a FlareSolverr proxy.
	 * @param path API path
	 * @private
	 */
	private async fetch<T>(path: string): Promise<T> {
		if (!this.options.flaresolverrUrl) return this.fetchDirect(path);

		const res = await fetch(this.options.flaresolverrUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				cmd: 'request.get',
				url: API_URL + path,
				returnRawHtml: true, // Removed in FlareSolverr v2
				maxTimout: 60000
			})
		}).then(res => {
			interface FlareSolverrResponse {
				status: string;
				solution: {
					response: string;
				};
			}

			return res.json() as unknown as FlareSolverrResponse;
		});

		if (res.status !== 'ok') {
			throw new FlareSolverrError(res, this.options.flaresolverrUrl);
		}

		// FlareSolverr returns the HTMl representation if returnRawHtml is unsupported
		if (res.solution.response.startsWith('<')) {
			const { parseDocument, DomUtils } = await import('htmlparser2');

			const document = parseDocument(res.solution.response);
			const preNode = DomUtils.getElementsByTagName('pre', document, true, 1);
			const json = DomUtils.textContent(preNode[0]);

			return this.parseApiResponse(json, path);
		} else {
			return this.parseApiResponse(res.solution.response, path);
		}
	}

	/**
	 * Node-fetch wrapper that handles nhentai API errors.
	 * @param path API path
	 * @returns The parsed JSON
	 * @private
	 */
	private async fetchDirect<T>(path: string): Promise<T> {
		return fetch(API_URL + path)
			.then(res => res.text())
			.then(text => {
				if (text.startsWith('<')) {
					throw new nhentaiAPIError(
						'Encountered a Cloudflare challenge! Consider using a FlareSolverr proxy.',
						path
					);
				}

				return this.parseApiResponse(text, path);
			});
	}

	private parseApiResponse<T>(content: string, path: string): T {
		let json: unknown;
		try {
			json = JSON.parse(content);
		} catch {
			throw new nhentaiAPIError(content, path);
		}

		if ((json as { error?: boolean }).error) {
			throw new nhentaiAPIError(json as Record<string, unknown>, path);
		} else {
			return json as T;
		}
	}

	/**
	 * Checks if a doujin doesn't have blacklisted tags (`API#options#blacklistedTags`)
	 * @param doujin The raw doujin returned from the API
	 */
	private isNotBlacklisted(doujin: APIDoujin): boolean {
		return !doujin.tags.some(tag => this.options.blacklistedTags?.includes(tag.name));
	}

	/**
	 * Check if a doujin exists. Bypasses `API#options#blacklistedTags`
	 * @param id ID of the doujin
	 */
	async doujinExists(id: number | string): Promise<boolean> {
		id = Number(id);
		if (isNaN(id)) {
			throw new TypeError('id is not a number');
		}
		if (id <= 0) {
			throw new RangeError('id cannot be lower than 1');
		}

		return fetch(`${API_URL}/gallery/${id}`, { method: 'HEAD' }).then(res => {
			switch (res.status) {
				case 200:
					return true;
				case 404:
					return false;
				default:
					throw new Error(`Unexpected status code (${res.status})`);
			}
		});
	}

	/**
	 * Fetch a doujin
	 * @param id ID of the doujin
	 */
	async fetchDoujin(id: number | string): Promise<Doujin | null> {
		id = Number(id);
		if (isNaN(id)) {
			throw new TypeError('id is not a number');
		}
		if (id <= 0) {
			throw new RangeError('id cannot be lower than 1');
		}

		return this.fetch<APIDoujin>(`/gallery/${id}`)
			.then(data => {
				return this.isNotBlacklisted(data) ? new Doujin(data) : null;
			})
			.catch(err => {
				if (err.response?.error === 'does not exist') return null;
				throw err;
			});
	}

	/**
	 * Fetch a doujin's comments. Bypasses `API#options#blacklistedTags`
	 * @param id ID of the doujin
	 */
	async fetchComments(id: number | string): Promise<Comment[] | null> {
		id = Number(id);
		if (isNaN(id)) {
			throw new TypeError('id is not a number');
		}
		if (id <= 0) {
			throw new RangeError('id cannot be lower than 1');
		}

		return this.fetch<APIComment[]>(`/gallery/${id}/comments`)
			.then(data => data.map(comment => new Comment(comment)))
			.catch(err => {
				if (err.response?.error === 'Gallery does not exist') return null;
				throw err;
			});
	}

	/**
	 * Fetch homepage doujins
	 * @param options Search Options
	 */
	async fetchHomepage(options: APISearchOptions = {}): Promise<SearchResult> {
		return this.search('*', options);
	}

	/**
	 * Search by string query
	 * @param options Search Options
	 */
	async search(query: string, options: APISearchOptions = {}): Promise<SearchResult> {
		if (options.page && isNaN(options.page)) {
			throw new TypeError('page is not a number');
		}
		if (options.sort && !SortValues.includes(options.sort)) {
			throw new TypeError('sort method is not valid');
		}

		// prettier-ignore
		const url = `/galleries/search?query=${query} ${options.language || ''}&page=${options.page || '1'}&sort=${options.sort || SortMethods.RECENT}`
		const data = await this.fetch<APISearchResult>(url);

		data.result = data.result.filter(this.isNotBlacklisted.bind(this));
		return new SearchResult(data);
	}

	/**
	 * Search doujins with this tag
	 * @param id Tag ID
	 * @param options Search Options
	 */
	async searchByTagID(id: number, options: APISearchOptions = {}): Promise<SearchResult> {
		if (isNaN(id)) {
			throw new TypeError('tagId is not a number');
		}
		if (options.page && isNaN(options.page)) {
			throw new TypeError('page is not a number');
		}
		if (options.sort && !SortValues.includes(options.sort)) {
			throw new TypeError('sort method is not valid');
		}

		// An empty &sort query param causes an error
		// prettier-ignore
		const url = `/galleries/tagged?tag_id=${id}&page=${options.page || '1'}${options.sort ? `&sort=${options.sort}` : ''}`
		const data = await this.fetch<APISearchResult>(url);

		data.result = data.result.filter(this.isNotBlacklisted.bind(this));
		return new SearchResult(data);
	}

	/**
	 * Find similar doujins
	 * @param id Doujin ID
	 */
	async searchRelated(id: number | string): Promise<SearchResult> {
		id = Number(id);
		if (isNaN(id)) {
			throw new TypeError('doujinID is not a number');
		}

		const data = await this.fetch<APISearchResult>(`/gallery/${id}/related`);

		data.result = data.result.filter(this.isNotBlacklisted.bind(this));
		return new SearchResult(data);
	}

	/**
	 * Fetch a random doujin ID.
	 * Bypasses `API#options#blacklistedTags`
	 */
	async randomDoujinID(): Promise<number> {
		return fetch(`${HOST_URL}/random`, { method: 'HEAD' }).then(data => {
			const match = data.url.match(/https?:\/\/nhentai\.net\/g\/(\d{1,7})\//);
			if (!match || !match[1]) throw new Error('Could not find doujin id in redirect url.');
			return Number(match[1]);
		});
	}

	/**
	 * Fetch a random doujin
	 * @param options.retries Amount of retries to find a non-blacklisted doujin. Default 5.
	 */
	async randomDoujin(options: { retries?: number } = {}): Promise<Doujin> {
		let retries = options.retries ?? 5;

		while (retries--) {
			const doujin = await this.fetchDoujin(await this.randomDoujinID());
			if (!doujin || !this.isNotBlacklisted(doujin.raw)) continue;
			return doujin;
		}
		throw new Error('Max retries exceeded');
	}
}

/**
 * Represents errors returned by the api (not network/fetch error)
 */
export class nhentaiAPIError extends Error {
	response: unknown;
	url: string;

	constructor(response: unknown, url: string) {
		super(typeof response === 'string' ? response : JSON.stringify(response));
		this.response = response;
		this.url = url;
		this.name = 'nhentaiAPIError';
		Error.captureStackTrace(this, nhentaiAPIError);
	}
}

/**
 * Represents errors returned by the FlareSolverr API (which could be wrapping an
 * nhentai API error).
 */
export class FlareSolverrError extends nhentaiAPIError {
	constructor(response: unknown, url: string) {
		super(response, url);
		this.name = 'FlareSolverrError';
		Error.captureStackTrace(this, FlareSolverrError);
	}
}
