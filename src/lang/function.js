/**
 * Lang - Function
 */

Bourbon.extend(Bourbon, {

	/**
	 * Binds an object to a function, and partially applies the function with usually one or more arguments
	 * @param {Object} context
	 * @param {Function} callback
	 * @returns {Function|Boolean}
	 */

	bind: function(context, callback) {
		var args = _slice.call(arguments, 2);

		if (arguments.length < 2 || (typeof callback !== "function")) {
			return false;
		}

		return function() {
			return callback.apply(context, args.concat(_slice.call(arguments)));
		};
	},

	/**
	 * Memoizes a function (storing results)
	 * @param {Function} callback
	 * @param {Function} hasher
	 * @returns {Function}
	 */

	memoize: function(callback, hasher) {
		var cache = {};

		hasher = (hasher || function(value) {
			return value;
		});

		return function() {
			var context = this;
			var args = arguments;
			var key = hasher.apply(context, args);

			return (_hasOwnProperty.call(cache, key) ? cache[key] : (cache[key] = callback.apply(context, args)));
		};
	},

	/**
	 * Partially applies the function, returning a function, with usually one or more arguments
	 * @param {Function} callback
	 * @returns {Function|Boolean}
	 */

	curry: function(callback) {
		var args = _slice.call(arguments, 1);

		if (typeof callback !== "function") {
			return false;
		}
		
		return function() {
			var context = this;

			return callback.apply(context, args.concat(_slice.call(arguments)));
		};
	},

	/**
	 * Invokes after invocation attempts stop, with a delay of x milliseconds 
	 * (if 'immediate' is truthy, then invocation will occur on leading edge, instead of trailing)
	 * @param {Function} callback
	 * @param {Number} wait
	 * @param {Boolean} immediate
	 * @returns {Function}
	 */

	debounce: function(callback, wait, immediate) {
		var timeout;

		return function() {
			var context = this;
			var args = arguments;
			var future = function() {
				timeout = null;
				
				if (!immediate) {
					callback.apply(context, args);
				}
			};
			var invokeImmediately = (immediate && !timeout);
			
			_root.clearTimeout(timeout);
			
			timeout = _root.setTimeout(future, wait);
			
			if (invokeImmediately) {
				callback.apply(context, args);
			}
		};
	},

	/**
	 * Invokes as many times as applicable without exceeding 
	 * invocations within a given timeframe of x milliseconds
	 * (if 'immediate' is truthy, then invocation will occur on leading edge, instead of trailing)
	 * @param {Function} callback
	 * @param {Number} wait
	 * @param {Boolean} immediate
	 * @returns {Function}
	 */

	throttle: function(callback, wait, immediate) {
		var timeout;

		return function() {
			var context = this;
			var args = arguments;
			var future = function() {
				timeout = null;

				if (!immediate) {
					callback.apply(context, args);
				}
			};
			var invokeImmediately = (immediate && !timeout);

			if (!timeout) {
				timeout = _root.setTimeout(future, wait);
			}

			if (invokeImmediately) {
				callback.apply(context, args);
			}
		};
	},

	/**
	 * Invokes a function once, returning the value of original call on subsequent calls
	 * @param {Function} callback
	 * @returns {Function}
	 */

	once: function(callback) {
		var cache;
		var invoked = false;
		
		return function() {
			var context = this;

			if (invoked) {
				return cache;
			}
			
			invoked = true;
			cache = callback.apply(context, arguments);
			callback = null;
			
			return cache;
		};
	},

	/**
	 * Wraps 'callback' inside of 'wrapper,' whilst passing it ('callback') as the first argument
	 * @param {Function} callback
	 * @param {Function} wrapper
	 * @returns {Function}
	 */

	wrap: function(callback, wrapper) {
		return function() {
			var context = this;
			var args = [callback];

			_push.apply(args, arguments);

			return wrapper.apply(context, args);
		};
	}
});
