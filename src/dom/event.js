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
