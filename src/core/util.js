/**
 * Core - Util
 */

/**
 * Copies all properties from 'source' to 'destination' object
 * @param {Object} destination
 * @param {Object} source
 * @returns {Object}
 */

Bourbon.extend = Bourbon.fn.extend = function(destination, source) {
	if (arguments.length !== 2) {
		source = arguments[0];
		destination = this;
	}

	for (var property in source) {
		destination[property] = source[property];
	}

	return destination;
};

/**
 * Creates an empty function
 * @returns {Void}
 */

Bourbon.noop = function() {};

Bourbon.extend({

	/**
	 * Sets the mode to 'prod' by default, so that logging doesn't occur
	 */

	mode: "prod",

	/**
	 * Logs information to the console, if 'Bourbon.mode' is set to either dev or qa
	 * @params {Object|Function|Boolean|Number|String|null|undefined}
	 * @returns {Void}
	 */

	log: (function() {
		if (typeof _root.console === "undefined" || typeof _root.console.log !== "function") {
			return Bourbon.noop;
		}

		return function() {
			if (/^(?:dev|qa)$/i.test(Bourbon.mode)) {
				console.log.apply(console, arguments);
			}
		};
	})(),

	/**
	 * Runs Bourbon.js in 'noConflict' mode
	 * @returns {Function}
	 */

	noConflict: function() {
		_root.Bourbon = _Bourbon;

		return Bourbon;
	}
});
