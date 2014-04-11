/**
 * Lang - Object
 */

Bourbon.extend({

	/**
	 * Clones the passed object using shallow copy
	 * @param {Object} source
	 * @returns {Object}
	 */

	clone: function(source) {
		return Bourbon.extend({}, source);
	},

	/**
	 * Determines whether a function is empty
	 * @param {Function} object
	 * @returns {Boolean}
	 */

	isEmptyFunction: function(object) {
		if (typeof object !== "function") {
			return false;
		}

		return Bourbon.trim(/^function [^(]*\(\)[ ]*{(.*)}$/.exec(
			object.toString().replace(/\n/g, "")
		)[1]) === "";
	},

	/**
	 * Determines whether 'object' is indeed an array
	 * @param {Object} object
	 * @returns {Boolean}
	 */

	isArray: (Array.isArray || function(object) {
		return (_toString.call(object) === "[object Array]");
	}),

	/**
	 * Determines whether 'object' is indeed an object
	 * @param {Object} object
	 * @returns {Boolean}
	 */

	isObject: function(object) {
		return (_toString.call(object) === "[object Object]");
	}
});
