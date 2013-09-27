
/*
Example:
obj = {
	append: overload(
	[String], function(str) {
	
	},
	[Number], function(num) {
	
	},
	[[String, Object], Object], function(mixed1, obj) {
	
	},
	[MyCustomTypeConstructor, Object], function(mixed1, obj) {
	
	})
}

// And then these invocations will be dispatched correctly based on their
// param types.
obj.append("Hello");
obj.append(1);
obj.append("Hello", {});
obj.append(new MyCustomTypeConstructor(), {});
*/

// TODO: this key based lookup won't correclty handle inheritance heirarchies...
(function() {
	if (typeof module === 'object' && module.exports) {
		// todo
		var c = require('./counter');
	}

	if (typeof window !== 'undefined')
		c = window.Counter;

	var Counter = c;
		

	function createDispatcher(map) {
		return function dispatcher() {
			var key = createInvokeKey(arguments);
			var funcsAndTypes = map[key];

			if (funcsAndTypes) {
				for (var i = 0; i < funcsAndTypes.length; ++i) {
					var fnAndTypes = funcsAndTypes[i];
					if (typesMatch(arguments, fnAndTypes[1]))
						return fnAndTypes[0].apply(this, arguments);
				}
			}

			console.log(map);
			throw 'Could not find desired method with key: ' + key;
		}
	}

	function createInvokeKey(args) {
		var key = "";
		for (var i = 0; i < args.length; ++i) {
			var arg = args[i];
			// TODO: better type determiner...
			if (arg instanceof Array)
				key += 'array';
			else
				key += typeof arg;
		}

		return key;
	}

	function typesMatch(callTypes, desiredTypes) {
		for (var i = 0; i < callTypes.length; ++i) {
			if (desiredTypes[i] === String && typeof callTypes[i] === 'string')
				continue;
			if (desiredTypes[i] === Number && typeof callTypes[i] === 'number')
				continue;
			if (!(callTypes[i] instanceof desiredTypes[i]))
				return false;
		}

		return true;
	}

	/*
	[types] fn
	[types] fn
	...
	*/
	function overload() {
		var dispatchMap = {};
		// multiple entries in the map for multiple type combinations?
		// entry keys as string reps of the types

		var args = Array.prototype.slice.call(arguments, 0);
		// lookup by doing a uniform conversion of param to type string.
		for (var i = 0; i < args.length; i+=2) {
			var types = args[i];
			var func = args[i+1];

			var keysAndDesiredTypes = createKeysAndDesiredTypes(types);
			addEntries(dispatchMap, keysAndDesiredTypes, func);
		}

		return createDispatcher(dispatchMap);
	}

	function createKeysAndDesiredTypes(types) {
		var keysAndTypes = [];
		var counter = new Counter(types);

		do {
			var indicies = counter.indexes();
			var keyTypes = counter.extract(types);
			var key = createEntryKey(types);
			keysAndTypes.push([key, keyTypes]);
			counter.next();
		} while (counter.hasNext());

		return keysAndTypes;
	}

	function createEntryKey(types) {
		var result = "";
		for (var i = 0; i < types.length; ++i) {
			result += getEntryStringFor(types[i]);
		}

		return result;
	}

	function getLookupStringFor(obj) {

	}

	function getEntryStringFor(type) {
		if (type !== Array && type !== Number && type !== String)
			type = Object;

		return type.name.toLowerCase();
	}

	function addEntries(dispatchMap, keysAndDesiredTypes, func) {
		for (var i = 0; i < keysAndDesiredTypes.length; ++i) {
			var key = keysAndDesiredTypes[i][0];
			var desiredTypes = keysAndDesiredTypes[i][1];

			var existing = dispatchMap[key];
			if (!existing) {
				existing = [];
				dispatchMap[key] = existing;
			}
			existing.push([func, desiredTypes]);
		}
	}

	if (typeof module === 'object' && module.exports)
		module.exports = overload;
	else if (typeof define === 'function' && define.amd)
		define(['./counter'], function(counter) {Counter = counter; return overload;});
	else
		window.overload = overload;
})();
