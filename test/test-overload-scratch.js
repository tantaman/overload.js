function assert(expr, msg) {
	if (!expr)
		throw 'Failed ' + msg;
}

var overload = require('../src/overload');

var obj = {
	div: overload(
	[Object, String], function() {
		return 'object, string';
	},
	[Object, Array], function() {
		return 'object, array';
	},
	[String], function() {
		return 'string';
	},
	[Array], function() {
		return 'array';
	})
};

assert(obj.div({}, "") == 'object, string');
assert(obj.div({}, []) == 'object, array');
assert(obj.div("") == 'string');
assert(obj.div([]) == 'array');