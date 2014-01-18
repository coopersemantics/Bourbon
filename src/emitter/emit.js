/**
 * Emitter - Emit
 */

/**
 * Emits event(s)
 * @public
 */

Bourbon.emitter = (function() {
	var emitter = {};

	Bourbon.extend(emitter, {
	
		/**
		 * Stores event(s)
		 */

		store: {},

		/**
		 * Observes event(s)
		 * @param {String} event
		 * @param {Function} callback
		 * @returns {String}
		 */

		on: function(event, callback) {
			var instance = this;
			var token;

			if (!_hasOwnProperty.call(instance.store, event)) {
				instance.store[event] = [];
				instance.subUid = -1;
			}

			token = (++instance.subUid).toString();

			instance.store[event].push({
				token: token,
				callback: callback
			});

			return token;
		},

		/**
		 * Removes event(s)
		 * @param {String} event
		 * @param {String|Function} tokenOrFunction
		 * @returns {Boolean|Function}
		 */

		off: function(event, tokenOrFunction) {
			var instance = this;
			var store = instance.store[event];
			var idx = -1;
			var isToken = (typeof tokenOrFunction === "string");
			var prop = (isToken && "token" || "callback");
			var len;

			if (!_hasOwnProperty.call(instance.store, event)) {
				return false;
			}

			if (typeof tokenOrFunction === "undefined") {
				store.splice(0);

				return false;
			}

			len = store.length;

			while (++idx < len) {
				if (store[idx][prop].toString() === tokenOrFunction.toString()) {
					store.splice(idx, 1);

					return tokenOrFunction;
				}
			}

			return false;
		},

		/**
		 * Emits event(s)
		 * @param {String} event
		 * @returns {Boolean}
		 */

		emit: function(event) {
			var instance = this;
			var args = arguments;

			if (!_hasOwnProperty.call(instance.store, event)) {
				return false;
			}

			_root.setTimeout(function() {
				var store = instance.store[event];
				var idx = -1;
				var len = store.length;

				while (++idx < len) {
					store[idx].callback.apply(null, args);
				}
			}, 1);

			return true;
		}
	});

	return emitter;
})();
