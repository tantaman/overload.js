Example:

```javascript
var obj = {
		div: overload(
		// Declare argument types via an array proceeding the function
		[Object, String], function(attrs, content) {
			return 'called with: object, string';
		},
		// Declare additional method overloads and their argument types the same way
		[Object, Array], function(attrs, content) {
			return 'called with: object, array';
		},
		[String], function(content) {
			// do whatever... maybe normalize the 
			// types and call yourself again
			// like:
			this.div({}, [content]);
			return 'called with: string';
		},
		[Array], function(content) {
			return 'called with: array';
		})
	};

	assert(obj.div({}, "") == 'called with: object, string');
	assert(obj.div({}, []) == 'called with: object, array');
	assert(obj.div("") == 'called with: string');
	assert(obj.div([]) == 'called with: array');
```
