export class Credit {
	/**@type {String}*/ movieId;
	/**@type {String}*/ movieTitle;
	/**@type {Number}*/ year;
	/**@type {String}*/ type;




	constructor(/**@type {HTMLElement}*/ filmoRow) {
		this.movieId = $(filmoRow, 'a').href.replace(/^.*\/title\/(tt\d+)\/.*$/, '$1');
		this.movieTitle = $(filmoRow, 'a').textContent;
		this.year = parseInt($(filmoRow, '.year_column').textContent) || 0;
		this.type = filmoRow.closest('.filmo-category-section').previousElementSibling.getAttribute('data-category');
	}
}