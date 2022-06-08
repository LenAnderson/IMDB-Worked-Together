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

import { App } from "./App.js";
import Actor from "./domain/Actor.js";

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




	// ${imports}




    const run = async()=>{
        log('run');
        const app = new App();
    };
    run();
    // const mo = new MutationObserver(muts=>run());
    // mo.observe(document.body, {childList:true, subtree:true, attributes:true});
})();