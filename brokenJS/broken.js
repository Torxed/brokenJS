/*
	Find out where in the path "we" are.
	We'll do this by getting the last loaded script (us)
	and check the `.src` tag, split it, remove the end and voila.
*/
var loadedScripts = document.getElementsByTagName('script');
var path = loadedScripts[loadedScripts.length-1].src.split('?')[0];
var __base__ = path.split('/').slice(0, -1).join('/')+'/';

/* Includes */
// TODO: The correct way of doing it (Chrome 70+):
//    import {getOriginVariable|*} from './brokenJS/hacks.js';
//
function ES5_import(url, callback=null) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	if(callback) {
		script.onreadystatechange = callback;
		script.onload = callback;
	}

	head.insertBefore(script, head.firstChild);
}

ES5_import(__base__+'./hacks.js');
ES5_import(__base__+'./constants.js');
ES5_import(__base__+'./helpers.js');

var timers = {};

class obj {
	constructor (id, content, on_load=null) {
		this.id = id;
		this.obj = null;
		this.content = content;
		if(!on_load)
			on_load = this.update;

		populate(this, {obj}, this.id, on_load);
	}

	move(dx, dy, absolute=true) {
		if(absolute) {
			this.x += dx;
			this.y += dy;
		} else {
			this.x = dx;
			this.y = dy;
		}
	}

	update() {
		console.log('Object ' + this.id + ' now exists');
		this.obj.id = this.id;
		if(this.content) {
			context.appendChild(this.content);
		}
	}

	append_to(what) {
		what.obj.appendChild(this.obj);
	}
}

class div extends obj {

	constructor(id, x=0, y=0, width=AUTO, height=AUTO, on_load=null) {
		super(id, on_load=on_load);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	create() {
		this.obj = document.createElement('div');
		this.obj.id = this.id;
		if(this.x || this.y)
			this.obj.style.position = 'absolute';
		this.obj.style.left = this.x; 
		this.obj.style.top = this.x;

		//var tmp = this.update;
		//var tmpUpdate = tmp.bind(this);
		//tmpUpdate();
		//this.update();
		this.update();
	}

	update(styledata={}) {
		for(var key in styledata) {
			// Update CSS accordingly
		}

		this.obj.id = this.id;

		if (this.width) {
			this.obj.width = this.width;
			this.obj.style.width = this.width;
			this.obj.style.overflowX = 'auto';
		}
		if (this.height) {
			this.obj.height = this.height;
			this.obj.style.height = this.height;
			this.obj.style.overflowY = 'auto';
		}

		if(this.x || this.y)
			this.obj.style.position = 'absolute';
		this.obj.style.left = this.x; 
		this.obj.style.top = this.x;

		if(this.content) {
			if(typeof this.content === str)
				this.obj.innerHTML = this.content;
			else
				this.obj.appendChild(this.content);
		}
	}
}