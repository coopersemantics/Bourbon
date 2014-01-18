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
