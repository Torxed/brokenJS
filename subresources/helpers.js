/**
 * gen_UID() generates a "unique" number.
 *
 * @param {integer} length - how long should the returned string rep be?
*/
function gen_UID(length=7) {
	return Math.random().toString(36).substring(length);
}

/**
 * getObj() returns a HTML object by ID [from within a parent]
 *
 * @param {string} id - The HTML ID tag of the object we're looking for
 * @param {Object} parent - Limits the search/grep to within the parent container
*/
function getObj(id, parent=null) {
	var obj = document.getElementById(id);
	if(obj === undefined || typeof obj == 'undefined')
		return null;
	return obj;
}

/**
 * populate(context, {variable}, object, func, poll_interval)
 *
 * populate will poll at a certain interval after a particular object,
 * once the object is found - it will update the given variable by
 * reversing the name of the passed variable (no matter variable type)
 * and then looking for the variable-name in the given context.
 * 
 * If found, the variable is updated and the func() is executed.
 * It's a arbritary function placeholder to optionally execute
 * code once the object and variable is updated.
 *
 * @param {Object} context - A context where we'll look for 'what'
 * @param {dict} what - Must be passed as {variable} form.
 * @param {string} With - the HTML-object to look for.
 * @param {function} func - A function to execute after the obj is found
 * @param {integer} poll_interval - How fast should the document.timer poll
*/
function populate(context, what, With, func, poll_interval=50) {
	var UID = With+'_'+gen_UID();
	setTimer(UID, function() {
		var o = getObj(With);
		if(o) {
			let varName = varReference(what);
//			console.log('Populating ' + varName + ' with ' + With);
			context[varName] = o;

			func.call(context);
			//var fx = func;
			//fx.call(context); // To preserve the context of `this`

			//for(var key in what) {
			//	console.log('Populating '+key+' with: ' + With);
			//	window[key.toString()] = o;
			//}

			//window[what] = o;
			clearTimer(UID);
		}
	}, poll_interval);
}

function destroy(obj) {
	// Try to remove on the class handle (first by string ref, then obj.id ref),
	// if it's missing, we'll call remove on the DOM.

	if (typeof obj === str && obj in frames)
		frames[obj].remove();
	else if(obj.id !== undefined && obj.id in frames)
		frames[obj.id].remove();
	else
		obj.remove();
}

function clearTimer(name) {
	if(timers[name] !== undefined) {
		window.clearInterval(timers[name]);
		return true;
	}
	return false;
}

function setTimer(name, func, time=10) {
	timers[name] = setInterval(func, time);
}

/*
> This belongs in a module, probably. But as of now,
  It's so tiny that it can live here.
*/
class socket {
	constructor(host, port=80, url='/') {
		this.host = host;
		this.port = port;
		this.url = url;
		this.connection = null;

		this.connect();
	}

	connect(host=null, port=null) {
		if(!this.host && host)
			this.host = host;
		if(!this.port && port)
			this.port = port;

		if(this.connection && this.connection.readyState != 3)
			this.connection.close()

		this.connection = new WebSocket('ws://'+this.host+':'+this.port+'/'+this.url);
		this.connection.onerror = this.onerror;
		this.connection.onmessage = this.onmessage;
		this.connection.onopen = this.onopen;
	}

	send(data) {
		if(typeof data !== str) {
			data = JSON.stringify(data);
		}

		// If connection is broken, reconnect and send
		if(this.connection && this.connection.readyState == 3) {
			this.connect();
			this.connection.onopen = function(event) {
				this.connection.send(data);
				this.connection.onopen = this.onopen;
			}
		// If not broken, send instantly.
		} else {
			this.connection.send(data);
		}
	}

	connected() {
		if(this.connection && this.connection.readyState == 2)
			return true;
		return false;
	}

	onopen(event) {
		// Empty placeholder
	}

	onerror(event) {
		// Empty placeholder
	}

	onmessage(event) {
		// Empty placeholder
	}
}