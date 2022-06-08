// ==UserScript==
// @name         IMDB - Worked Together
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/IMDB-Worked-Together/raw/master/imdb-worked-together.user.js
// @version      0.1
// @description  See which actors worked together.
// @author       LenAnderson
// @match        https://www.imdb.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        none
// ==/UserScript==




(function() {
    'use strict';

	const log = (...msgs)=>console.log.call(console.log, '[IMDB-WT]', ...msgs);

	const $ = (root,query)=>(query?root:document).querySelector(query?query:root);
	const $$ = (root,query)=>Array.from((query?root:document).querySelectorAll(query?query:root));

	const wait = async(millis)=>(new Promise(resolve=>setTimeout(resolve,millis)));

	const fetchHtml = async(url)=>{
		const html = document.createElement('div');
		html.innerHTML = await (await fetch(url)).text();
		return html;
	};

// ---------------- IMPORTS  ----------------



// C:\Temp\userscripts\imdb-worked-together\src\domain\Credit.js
class Credit {
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


// C:\Temp\userscripts\imdb-worked-together\src\domain\Actor.js


class Actor {
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


// C:\Temp\userscripts\imdb-worked-together\src\App.js


class App {
	/**@type {Number}*/ #loading = 0;
	get loading() {
		return this.#loading;
	}
	set loading(value) {
		this.#loading = value;
		if (value > 0) {
			this.panel.classList.add('imdb-wt--loading');
		} else {
			this.panel.classList.remove('imdb-wt--loading');
		}
	}
	/**@type {Actor[]}*/ actorList = [];

	/**@type {HTMLElement}*/ panel;
	/**@type {HTMLElement}*/ subtitle;
	/**@type {HTMLElement}*/ movies;


	get checked() {
		return this.actorList.filter(it=>it.checked);
	}




	constructor() {
		const style = document.createElement('style'); {
			style.innerHTML = '.imdb-wt--panel {  position: fixed;  top: 2px;  left: 2px;  width: 300px;  height: 66vh;  z-index: 1000;  background-color: #1f1f1f;  border: 4px solid #f5c518;  font-family: Roboto, Helvetica, Arial, sans-serif;  overflow: auto;}.imdb-wt--panel.imdb-wt--loading:after {  content: \"\";  display: block;  position: absolute;  top: 0;  right: 0;  left: 0;  bottom: 0;  background-color: rgba(0, 0, 0, 0.5);}.imdb-wt--panel > .imdb-wt--title {  color: rgba(247, 247, 247, 0.87);  font-weight: bold;  text-align: center;}.imdb-wt--panel > .imdb-wt--subtitle {  color: rgba(247, 247, 247, 0.87);  text-align: center;}.imdb-wt--panel .imdb-wt--movie > a {  background-color: rgba(247, 247, 247, 0.12);  border: 1px solid rgba(247, 247, 247, 0.24);  border-radius: 4px;  display: block;  margin: 0.5em;  padding: 0.25em;  text-decoration: none;}.imdb-wt--panel .imdb-wt--movie > a > .imdb-wt--movieTitle {  color: white;  font-size: 0.9em;}.imdb-wt--panel .imdb-wt--movie > a > .imdb-wt--creditList {  color: rgba(247, 247, 247, 0.75);  font-size: 0.8em;  padding-left: 0.5em;}';
			document.body.append(style);
		}
		const panel = document.createElement('div'); {
			this.panel = panel;
			panel.classList.add('imdb-wt--panel');
			const title = document.createElement('div'); {
				title.classList.add('imdb-wt--title');
				title.textContent = 'Worked together';
				panel.append(title);
			}
			const subtitle = document.createElement('div'); {
				this.subtitle = subtitle;
				subtitle.classList.add('imdb-wt--subtitle');
				subtitle.textContent = this.checked.map(it=>it.name).join('; ');
				panel.append(subtitle);
			}
			const movies = document.createElement('ul'); {
				this.movies = movies;
				movies.classList.add('imdb-wt--movieList');
				panel.append(movies);
			}
			document.body.append(panel);
		}
		$$('[data-testid="title-cast-item"]:not([data-imdb-wt])').forEach(cast=>{
            log(cast);
            cast.setAttribute('data-imdb-wt', 1);
			const controls = document.createElement('div'); {
				const lbl = document.createElement('label'); {
					const cb = document.createElement('input'); {
						cb.type = 'checkbox';
						cb.addEventListener('click', async(evt)=>{
							this.addActor($(cast, '[data-testid="title-cast-item__actor"]').href.replace(/^.*\/name\/(nm\d+).*$/, '$1')).then(actor=>{
								actor.checked = cb.checked;
								this.update();
							});
							this.update();
						});
						lbl.append(cb);
					}
					lbl.append(document.createTextNode(' worked together'));
					controls.append(lbl);
				}
				$(cast, '.title-cast-item__characters-list').insertAdjacentElement('afterend', controls);
			}
        });
	}


	async addActor(/**@type {String}*/id) {
		this.loading++;
		const actor = await Actor.get(id);
		if (this.actorList.indexOf(actor) ==- 1) {
			this.actorList.push(actor);
		}
		this.loading--;
		return actor;
	}




	async update() {
		this.subtitle.textContent = '';
		this.movies.innerHTML = '';
		if (this.loading == 0 || true) {
			this.subtitle.textContent = this.checked.map(it=>it.name).join('; ');
			if (this.checked.length > 1) {
				const movies = {};
				const together = {};
				this.checked.forEach((actor,idx)=>{
					actor.creditList.filter(it=>it.type!='self'&&it.type!='archive_footage').forEach(credit=>{
						if (idx == 0) {
							if (!movies[credit.movieId]) {
								movies[credit.movieId] = {};
							}
							if (!movies[credit.movieId][credit.year]) {
								movies[credit.movieId][credit.year] = [];
							}
							movies[credit.movieId][credit.year].push([actor, credit]);
						} else if (movies[credit.movieId] && movies[credit.movieId][credit.year]) {
							movies[credit.movieId][credit.year].push([actor, credit]);
						}
					});
				});
				log('movies', movies);
				Object.keys(movies).forEach(movieId=>{
					Object.keys(movies[movieId]).forEach(year=>{
						let actors = movies[movieId][year].map(it=>it[0].id);
						actors = actors.filter((it,idx)=>actors.indexOf(it)==idx);
						if (actors.length == this.checked.length) {
							if (!together[movieId]) {
								together[movieId] = {};
							}
							together[movieId][year] = movies[movieId][year];
						}
					});
				});
				log('together', together);
	
				Object.keys(together).forEach(movieId=>{
					Object.keys(together[movieId]).forEach(year=>{
						const item = together[movieId][year];
						const li = document.createElement('li'); {
							li.classList.add('imdb-wt--movie');
							const link = document.createElement('a'); {
								link.href = `/title/${movieId}`;
								const title = document.createElement('div'); {
									title.classList.add('imdb-wt--movieTitle');
									title.textContent = `${item[0][1].movieTitle} (${item[0][1].year})`;
									link.append(title);
								}
								const credits = document.createElement('ul'); {
									credits.classList.add('imdb-wt--creditList');
									item.forEach(it=>{
										const cred = document.createElement('li'); {
											cred.textContent = `${it[0].name} (${it[1].type})`;
											credits.append(cred);
										}
									});
									link.append(credits);
								}
								li.append(link);
							}
							this.movies.append(li);
						}
					});
				});
			}
		}
	}
}
// ---------------- /IMPORTS ----------------





    const run = async()=>{
        log('run');
        const app = new App();
    };
    run();
    // const mo = new MutationObserver(muts=>run());
    // mo.observe(document.body, {childList:true, subtree:true, attributes:true});
})();