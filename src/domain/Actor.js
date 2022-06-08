import { Credit } from "./Credit.js";

export class Actor {
	/**type {Actor[]}*/ static cache = {};


	static async get(/**type {String}*/id) {
		if (!this.cache[id]) {
			this.cache[id] = await this.load(id);
		}
		return this.cache[id];
	}

	static async load(/**type {String}*/id) {
		const page = await fetchHtml(`https://www.imdb.com/name/${id}/`);
		log('actor', page);
		const name = $(page, 'h1.header').textContent.trim();
		const credits = $$(page, '.filmo-row').map(it=>new Credit(it));
		return new Actor(id, name, credits);
	}




	/**@type {String}*/ id;
	/**@type {String}*/ name;
	/**@type {Credit[]}*/ creditList;
	/**@type {Boolean}*/ checked = false;




	constructor(id, name, credits) {
		this.id = id;
		this.name = name;
		this.creditList = credits;
	}
}