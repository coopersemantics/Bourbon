/**!
 * Bourbon.js - JavaScript Library v0.1.1
 *
 * Copyright 2014, coopersemantics
 * Bourbon.js is freely distributable under the MIT license.
 *
 * Date: Sat Jan 18 2014 01:30:18
 */
 
 (function(definition) {

/**
 * Node.js
 */

if (typeof module !== "undefined" && module.exports) {
	module.exports = definition();
} else {
	this.Bourbon = definition();

	/**
	 * AMD module
	 */

	if (typeof define === "function" && define.amd) {
		define(definition);
	}
}

})(function() {

/**
 * Core - Var
 */

var _root = this;
var _ArrayProto = Array.prototype;
var _ObjectProto = Object.prototype;
var _slice = _ArrayProto.slice;
var _push = _ArrayProto.push;
var _toString = _ObjectProto.toString;
var _hasOwnProperty = _ObjectProto.hasOwnProperty;
var _doc = document;
var _isIELegacyEvent = (_root.attachEvent && !_root.addEventListener);

/**
 * Core - Init
 */

/**
 * Map over Bourbon in case of an overwrite
 */

var _Bourbon = _root.Bourbon;

/**
 * Creates a new instance of Bourbon
 * @constructor
 * @param {Node} node
 * @returns {Object}
 * @public
 */

var Bourbon = function(node, index) {
	return new Bourbon.fn.init(node, index);
};

/**
 * Bourbon's current version
 */

Bourbon.version = "0.1.1";

Bourbon.fn = Bourbon.prototype;

/**
 * @constructs Bourbon
 * @param {Node} node
 */

Bourbon.fn.init = function(node) {
	this.node = (node || []);
};

Bourbon.fn.init.prototype = Bourbon.fn;

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
	for (var property in source) {
		destination[property] = source[property];
	}

	return destination;
};

/**
 * Merges 'source' to 'destination' and returns the result of that merge
 * @param {Object} destination
 * @param {Object} source
 * @returns {Object}
 */

Bourbon.merge = Bourbon.fn.merge = function(destination, source) {
	for (var property in source) {
		if (!_hasOwnProperty.call(destination, property)) {
			destination[property] = source[property];
		}
	}

	return destination;
};

/**
 * Creates an empty function
 * @returns {Void}
 */

Bourbon.noop = function() {};

Bourbon.extend(Bourbon, {

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
	 * Creates a plugin architecture
	 * @param {Object} destination
	 * @param {Object} source
	 * @returns {Void}
	 */

	addMethod: function(destination, source) {
		Bourbon.merge(destination, source);
	},

	/**
	 * Runs Bourbon.js in 'noConflict' mode
	 * @returns {Function}
	 */

	noConflict: function() {
		if (typeof _Bourbon !== "undefined") {
			_root.Bourbon = _Bourbon;
		}
		
		return Bourbon;
	}
});

/**
 * DOM - Selector
 */

Bourbon.extend(Bourbon.fn, {
	
	/**
	 * Retrieves the raw node
	 * @param {Number} index
	 * @returns {Node}
	 */

	get: function(index) {
		var instance = this;

		return (typeof index === "number" && instance.node[index] || instance.node);
	},

	/**
	 * Removes comments and whitespace-only text nodes
	 * @param {node} node
	 * @returns {this}
	 */

	clean: function clean(node) {
		var instance = this;
		var idx = 0;
		var temp;
		var child;

		node = (node || instance.node);
		
		child = node.childNodes;
		
		while ((temp = child[idx++])) {
			switch(temp.nodeType) {
			case 1:
				clean(temp);

				break;
			case 3:
				if (/\S/.test(temp.nodeValue)) {
					break;
				}
				/* falls through */
			case 8:
				node.removeChild(temp);

				idx--;
			}
		}

		return instance;
	},

	/**
	 * Converts a Node to an actual array
	 * @returns {Array}
	 */

	toArray: function() {
		var instance = this;

		return _slice.call(instance.node);
	}
});

Bourbon.extend(Bourbon, {
	/**
	 * Checks whether an object is indeed an element
	 * @param {Object} object
	 * @returns {Boolean}
	 */

	isElement: function(object) {
		return !!(object && object.nodeType === 1);
	}
});

/**
 * DOM - Event
 */

Bourbon.extend(Bourbon, {

	/**
	 * Executes a given callback, once the DOM is fully loaded
	 * @see https://github.com/ded/domready/blob/master/src/ready.js 
	 * @Note Rewrote by coopersemantics (Be clear, not clever!)
	 * @param {Function} callback
	 * @returns {Void|Number}
	 */

	onReady: (function() {
		var callbacks = [];
		var docElement = _doc.documentElement;
		var doScroll = docElement.doScroll;
		var isLoaded = (doScroll ? /^loaded|^c/ : /^loaded|c/).test(_doc.readyState);
		var completed = function() {
			var callback;

			isLoaded = true;
			
			while ((callback = callbacks.shift())) {
				callback();
			}
		};
		
		if (_isIELegacyEvent && doScroll) {
			_doc.attachEvent("onreadystatechange", function callback() {
				if (/^c/.test(_doc.readyState)) {
					_doc.detachEvent("onreadystatechange", callback);
					completed();
				}
			});

			return function scrollCheck(callback) {
				if (self !== top) {
					if (isLoaded) {
						return callback();
					}

					callbacks.push(callback);
				} else {
					try {
						docElement.doScroll("left");
					} catch (e) {
						return _root.setTimeout(function() { 
							scrollCheck(callback);
						}, 50);
					}
					
					callback();
				}
			};
		} 
			
		_doc.addEventListener("DOMContentLoaded", function callback() {
			_doc.removeEventListener("DOMContentLoaded", callback, false);
			completed();
		}, false);
		
		return function(callback) {
			if (isLoaded) {
				return callback();
			}
				
			callbacks.push(callback);
		};
	})(),

	/**
	 * Addresses event handling
	 * @constructor
	 * @param {Object} event
	 * @public
	 */

	Event: (function() {
		var Event = function(event) {
			if (!(this instanceof Bourbon.Event)) {
				return new Bourbon.Event(event);
			}

			this.event = (event || {});
		};

		Bourbon.extend(Event.prototype, {
	
			/**
			 * Prevents the default action from occuring
			 * @returns {Void}
			 */

			preventDefault: (function() {
				if (_isIELegacyEvent) {
					return function() {
						var instance = this;
						
						instance.event.returnValue = false;
					};
				}

				return function() {
					var instance = this;

					instance.event.preventDefault();
				};
			})(),

			/**
			 * Prevents the default action, and additionally, stops propagation
			 * @returns {Void}
			 */

			stopPropagation: (function() {
				if (_isIELegacyEvent) {
					return function() {
						var instance = this;

						instance.event.cancelBubble = true;
					};
				}

				return function() {
					var instance = this;

					instance.event.stopPropagation();
				};
			})(),

			/**
			 * Returns the target node
			 * @returns {Node}
			 */

			target: (function() {
				if (_isIELegacyEvent) {
					return function() {
						var instance = this;

						return instance.event.srcElement;
					};
				}

				return function() {
					var instance = this;

					return instance.event.target;
				};
			})()
		});
		
		return Event;
	})()
});

Bourbon.extend(Bourbon.fn, {

	/**
	 * Registers event handler(s)
	 * @param {Object} event
	 * @param {Function} callback
	 * @returns {this}
	 */

	on: (function() {
		if (_isIELegacyEvent) {
			return function(event, callback) {
				var instance = this;

				instance.node.attachEvent("on" + event, callback);

				return instance;
			};
		}

		return function(event, callback) {
			var instance = this;

			instance.node.addEventListener(event, callback, false);

			return instance;
		};
	})(),

	/**
	 * Unregisters event handler(s)
	 * @param {Object} event
	 * @param {Function} callback
	 * @returns {this}
	 */

	off: (function() {
		if (_isIELegacyEvent) {
			return function(event, callback) {
				var instance = this;

				instance.node.detachEvent("on" + event, callback);

				return instance;
			};
		}

		return function(event, callback) {
			var instance = this;
			
			instance.node.removeEventListener(event, callback, false);
		};
	})(),

	/**
	 * Triggers event handler(s)
	 * @param {Object} event
	 * @returns {this}
	 */

	trigger: (function() {
		if (_doc.createEventObject) {
			return function(event) {
				var instance = this;
				var createEvent = _doc.createEventObject();

				instance.node.fireEvent("on" + event, createEvent);

				return instance;
			};
		}

		return function(event) {
			var instance = this;
			var createEvent = _doc.createEvent("HTMLEvents");
			
			createEvent.initEvent(event, true, true); 
			instance.node.dispatchEvent(createEvent);

			return instance;
		};
	})()
});

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

/**
 * Lang - Object
 */

Bourbon.extend(Bourbon, {

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

/**
 * Lang - Array
 */

Bourbon.extend(Bourbon, {

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

/**
 * Lang - String
 */
 
Bourbon.extend(Bourbon, {

	/**
	 * Strips all leading and trailing whitespace from a string
	 * @param {String} string
	 * @returns {String}
	 */

	trim: (String.trim || function(string) {
		return string.replace(/^\s+/, "").replace(/\s+$/, "");
	})
});

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

return Bourbon;

});
