/**
 * DOM - Selector
 */

Bourbon.fn.extend({
	
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

Bourbon.extend({
	/**
	 * Checks whether an object is indeed an element
	 * @param {Object} object
	 * @returns {Boolean}
	 */

	isElement: function(object) {
		return !!(object && object.nodeType === 1);
	}
});
