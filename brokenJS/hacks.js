/* UGLY HACKS */
// None of these should ever be needed.
// But because JS is so extremely limited
// in it's way of thinking, some of these has
// to be done until further development of JS is done.

/**
 * Get name of passed variable,
 * because JavaScript is `passed by value`
 * and not `passed by reference`, this is a
 * workaround to enable (async)functions to
 * treat passed parameters (comes in as a value)
 * as if they were a reference (by returning the
 * original variable-name of the passed value).
 * origVar=5 -> func(origVar) -> 
 *   func(param) {...} == func(5) {...} ->
 *   
 *   getOriginVariable(param) { print(getOriginVariable(param)) }
 *   - This would give `origVar`.
 *
 * @param {Object} variable
*/
let getOriginVariable = (variable) => {
	for (let name in variable)
		return name;
}