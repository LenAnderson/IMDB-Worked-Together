import { Actor } from "./domain/Actor.js";

export class App {
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
			style.innerHTML = '${include-min-esc: style.css}';
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