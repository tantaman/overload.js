Example:

```javascript
var obj = {
		div: overload(
		// Declare argument types via an array proceeding the function
		[Object, String], function(attrs, content) {
			return 'object, string';
		},
		// Declare additional method overload and their argument types the same way
		[Object, Array], function(attrs, content) {
			return 'object, array';
		},
		[String], function(content) {
			return 'string';
		},
		[Array], function(content) {
			return 'array';
		})
	};

	assert(obj.div({}, "") == 'object, string');
	assert(obj.div({}, []) == 'object, array');
	assert(obj.div("") == 'string');
	assert(obj.div([]) == 'array');
```