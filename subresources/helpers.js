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
	set_timer(UID, function() {
		var o = getObj(With);
		if(o) {
			let varName = getOriginVariable(what);
			console.log('Populating ' + varName + ' with ' + With);
			context[varName] = o;

			func.call(context);
			//var fx = func;
			//fx.call(context); // To preserve the context of `this`

			//for(var key in what) {
			//	console.log('Populating '+key+' with: ' + With);
			//	window[key.toString()] = o;
			//}

			//window[what] = o;
			clear_timer(UID);
		}
	}, poll_interval);
}

function clear_timer(name) {
	if(timers[name] !== undefined) {
		window.clearInterval(timers[name]);
		return true;
	}
	return false;
}

function set_timer(name, func, time=10) {
	timers[name] = setInterval(func, time);
}