(function() {
	/*
	Variable base:
	Num = N[i] * B[i-1] * B[i-2] * ... + N[i-1] * B[i-2] * B[i-3] * ... + N[1] * B[0] + N[0]
	*/

	function bases(array) {
		var bases = [];
		for (var i = 0; i < array.length; ++i) {
			bases[i] = Math.max(array[i].length, 1);
		}

		return bases;
	}

	function maxCount(bases, n) {
		var count = 1;
		if (n == null)
			n = bases.length;

		for (var i = 0; i < n; ++i) {
			count *= bases[i];
		}

		return count;
	}

	function value(bases, counter) {
		var count = 0;
		for (var i = 0; i < bases.length; ++i) {
			count += counter[i] * maxCount(bases, i);
		}

		return count;
	}

	function allZeros(array) {
		for (var i = 0; i < array.length; ++i) {
			if (array[i] !== 0)
				return false;
		}

		return true;
	}

	function allMaxed(bases, counter) {
		for (var i = 0; i < bases.length; ++i) {
			if (counter[i] !== bases[i] - 1)
				return false;
		}

		return true;
	}

	function increment(bases, counter) {
		for (var i = 0; i < counter.length; ++i) {
			var val = counter[i];
			val += 1;
			if (val > bases[i] - 1)
				counter[i] = 0;
			else {
				counter[i] = val;
				break;
			}
		}
	}

	function decrement(bases, counter) {
		for (var i = 0; i < counter.length; --i) {
			var val = counter[i];
			val -= 1;
			if (val >= 0) {
				counter[i] = val;
				break;
			} else {
				counter[i] = bases[i] - 1;
			}
		}
	}

	function extract(counter, array) {
		var result = [];
		for (var i = 0; i < counter.length; ++i) {
			var v = array[i];
			if (v instanceof Array)
				result.push(array[i][counter[i]]);
			else
				result.push(array[i]);
		}

		return result;
	}

	var defaults = {
		baseArray: false
	};

	function Counter(array, opts) {
		opts = opts || defaults;

		if (!opts.baseArray)
			this._bases = bases(array);
		else
			this._bases = array;

		this._counter = [];
		for (var i = 0; i < this._bases.length; ++i) {
			this._counter.push(0);
		}

		this._maxCount = maxCount(this._bases);
	}

	Counter.prototype = {
		maxCombinations: function() {
			return this._maxCount;
		},

		value: function() {
			return value(this._bases, this._counter);
		},

		indexes: function() {
			return this._counter;
		},

		next: function() {
			increment(this._bases, this._counter);
			return this;
		},

		hasNext: function() {
			return !allMaxed(this._bases, this._counter);
		},

		previous: function() {
			decrement(this._bases, this._counter);
			return this;
		},

		hasPrevious: function() {
			return !allZeros(this._counter);
		},

		extract: function(array) {
			return extract(this._counter, array);
		}
	};

	if (typeof module === 'object' && module.exports)
		module.exports = Counter;
	else if (typeof define === 'function' && define.amd)
		define(function() {return Counter;});
	else
		window.Counter = Counter;
})();