export class Movie {
	/**typeof {Movie[]}*/ static cache = {};

	
	static async get(/**typeof {String}*/id) {
		if (!this.cache[id]) {
			this.cache[id] = await this.load(id);
		}
		return this.cache[id];
	}

	static async load(/**typeof {String}*/id) {
		const page = await fetchHtml(`https://www.imdb.com/title/${id}/`);
		log('movie', page);
		const title = $(page, '[data-testid="hero-title-block__title"]').textContent.trim();
		const year = parseInt($(page, '[data-testid="hero-title-block__metadata"] > li').textContent.trim());
		return new Movie(id, title, year);
	}




	/**@typeof {String}*/ id;
	/**@typeof {String}*/ title;
	/**@typeof {Number}*/ year;
	/**@typeof {Actor[]}*/ actorList = [];




	constructor(id, title, year) {
		this.id = id;
		this.title = title;
		this.year = year;
	}
}