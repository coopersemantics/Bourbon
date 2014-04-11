/**
 * Lang - Array
 */

Bourbon.extend({

	/**
	 * Flattens array
	 * @param {Array} array
	 * @returns {Array}
	 */

	flatten: function flatten(array) {
		var flat = [];
		var len = array.length;
		var idx = -1;
		var regex = /^(?:array|collection|arguments)$/;
		var type;
		var val;

		while (++idx < len) {
			val = array[idx];
			type = _toString.call(val)
				.split(" ")
				.pop()
				.split("]")
				.shift()
				.toLowerCase();

			if (type) { 
				flat = flat.concat(regex.test(type) ? flatten(val) : val); 
			}
		}

		return flat;
	}
});
