// https://stackoverflow.com/a/18090877/929999

/*
	Find out where in the path "we" are.
	We'll do this by getting the last loaded script (us)
	and check the `.src` tag, split it, remove the end and voila.
*/
const loadedScripts = document.getElementsByTagName('script');
const path = loadedScripts[loadedScripts.length-1].src.split('?')[0];
const __base__ = path.split('/').slice(0, -1).join('/')+'/';

/* Includes */
// TODO: The correct way of doing it (Chrome 70+):
//    import {varReference|*} from './brokenJS/hacks.js';
//
function ES5_import(url, callback=null) {
	const head = document.getElementsByTagName('head')[0];
	const script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = url;

	if(callback) {
		script.onreadystatechange = callback.call(script);
		script.onload = callback.call(script);
	}

	//head.insertBefore(script, head.firstChild);
	document.currentScript.parentNode.insertBefore(script, document.currentScript);
}

ES5_import(__base__+'subresources/hacks.js');
ES5_import(__base__+'subresources/constants.js');
ES5_import(__base__+'subresources/helpers.js');

var timers = {};
var frames = {};

const key = {
	ENTER : 13
};

var div_keyHooks = {};

class brokenObj {
	constructor (id, content, on_load=null) {
		this.id = id;
		this.obj = null;
		this.content = content;
		this.parent = window;
		frames[this.id] = this;
		if(!on_load)
			on_load = this.update;

		var tmpObj = this.obj;
		populate(this, {tmpObj}, this.id, on_load);
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

	remove() {
		if(this.obj)
			this.obj.remove();
		delete(frames[this.id]);
		// Something else.
	}

	click(f) {
		if (this.obj)
			this.obj.onclick = f;
		else
			this.onclick = f;
	}

	update() {
		console.log('Object ' + this.id + ' now exists');
		this.obj.id = this.id;
		if(this.content) {
			context.appendChild(this.content);
		}
	}

	append_to(what) {
		this.parent = what;
		what.obj.appendChild(this.obj);
	}
}

class div extends brokenObj {

	constructor(id, x=0, y=0, width=AUTO, height=AUTO, content=null, on_load=null) {
		super(id, content, on_load);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.key_events = {};
	}

	clear() {
		this.obj.innerHTML = '';
	}

	create() {
		this.obj = document.createElement('div');
		this.obj.id = this.id;
		if(this.x || this.y)
			this.obj.style.position = 'absolute';
		this.obj.style.left = this.x; 
		this.obj.style.top = this.y;
		this.obj.onkeypress = this._onKeyPress;

		//var tmp = this.update;
		//var tmpUpdate = tmp.bind(this);
		//tmpUpdate();
		//this.update();
		this.update();
		return this;
	}

	_onKeyPress(event) {
		var symbol = event.keyCode || event.which;

		if ((symbol in div_keyHooks) && (this.id in div_keyHooks[symbol])) {
			const ctx = div_keyHooks[symbol][this.id]['context'];
			div_keyHooks[symbol][this.id]['func'].call(ctx, this, event);
		}
	}

	/** Function to _register_ key-press events.
	*
	* @param {Integer} key - defines the symbol (keyboard value) pressed to hook in to.
	* @param {Function} func - the function() code called when a trigger is met.
	*/
	on_keypress(key, func) {
		if(!(key in div_keyHooks))
			div_keyHooks[key] = {}
		
		div_keyHooks[key][this.id] = {'context': this, 'func' : func};
	}

	absolute() {
		this.obj.style.position = 'absolute';
	}

	add_element(obj) {
		if(obj) {
			if(typeof obj === str)
				this.obj.innerHTML = this.obj.innerHTML + obj;
			else
				this.obj.appendChild(obj.obj);
			this.parent = obj;
		}
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
		this.obj.style.top = this.y;

		if(this.content) {
			this.add_element.call(this, this.content);
//			if(typeof this.content === str)
//				this.obj.innerHTML = this.content;
//			else
//				this.obj.appendChild(this.content);
			this.content = null;
		}
	}
}