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

Bourbon.version = "<%= pkg.version %>";

Bourbon.fn = Bourbon.prototype;

/**
 * @constructs Bourbon
 * @param {Node} node
 */

Bourbon.fn.init = function(node) {
	this.node = (node || []);
};

Bourbon.fn.init.prototype = Bourbon.fn;
