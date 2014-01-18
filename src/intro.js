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
