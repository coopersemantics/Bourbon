/****************************************************************
 * demo.js
 ***************************************************************/

(function() {

	"use strict";

	/**
	 * Sets the mode to 'dev' which enables logging
	 */

	Bourbon.mode = "dev";

	/**
	 * An example of how a plugin would be constructed 
	 */

	Bourbon.addMethod(Bourbon.fn, {
		highlight: function(cssText) {
			var instance = this;

			instance.node.style.cssText = cssText;

			return instance;
		}
	});

	/**
	 * Demo
	 * @private
	 */

	({

		/**
		 * Initializes object
		 * @returns {Void}
		 */

		initialize: function() {
			var instance = this;
			var elements = instance.elements = {
				actionGetRequest: Bourbon(document.querySelectorAll("[data-method='getRequest']")[0])
			};

			if (!Bourbon.isElement(elements.actionGetRequest.get())) {
				return;
			}

			instance.setListeners();
		},

		/**
		 * Sets listeners
		 * @returns {Void}
		 */

		setListeners: function() {
			var instance = this;

			instance.elements.actionGetRequest.on("click", Bourbon.bind(instance, Bourbon.debounce(instance.registerHandler, 500)));
			Bourbon.emitter.on("formatResponseComplete", Bourbon.bind(instance, instance.renderResponse));
		},

		/**
		 * Registers event handler
		 * @param {Object} event
		 * @returns {Void}
		 */

		registerHandler: function(event) {
			var instance = this;

			event = Bourbon.Event(event);

			event.preventDefault();
			instance.getRequest(instance.formatResponse);
		},

		/**
		 * Gets Ajax request
		 * @param {Function} callback
		 * @returns {Void}
		 */

		getRequest: function(callback) {
			var instance = this;
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = Bourbon.bind(instance, callback, xhr);

			xhr.open("get", "json/demo.json", true);
			xhr.send(null);

			xhr = null;
		},

		/**
		 * Formats the response
		 * @param {Object} xhr
		 * @param {Object} request
		 * @returns {Void}
		 */

		formatResponse: function(xhr, request) {
			var instance = this;

			if (xhr.readyState !== 4 || xhr.status !== 200) {
				return;
			}

			instance.barBaz = (JSON.parse(xhr.responseText).demo + " Time");

			Bourbon.log("formatResponseComplete emitted!", request);
			Bourbon.emitter.emit("formatResponseComplete");
		},

		/**
		 * Renders the response
		 * @returns {Void}
		 */

		renderResponse: function() {
			var instance = this;

			instance.elements.actionGetRequest
				.highlight("background: #fff; color: #000;")
				.get()
				.innerHTML = instance.barBaz;
		}
	}).initialize();

})();
