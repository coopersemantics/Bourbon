/**
 * Lang - String
 */
 
Bourbon.extend({

	/**
	 * Strips all leading and trailing whitespace from a string
	 * @param {String} string
	 * @returns {String}
	 */

	trim: (String.trim || function(string) {
		return string.replace(/^\s+/, "").replace(/\s+$/, "");
	})
});
