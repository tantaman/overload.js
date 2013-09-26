/*
Just a scratch area until more formal tests are developed
*/
function assert(expr, msg) {
	if (!expr)
		throw 'Failed ' + msg;
}

var Counter = require('../src/counter');


var arr = [
			[0,1,2,3],
			[0,1,1],
			[0,0,0]
		  ];
var indexer = new Counter(arr);

assert(indexer.hasNext());
assert(!indexer.hasPrevious());
assert(indexer.maxCombinations() == 36);

for (var i = 0; i < 36; ++i) {
	console.log(indexer);
	assert(indexer.value() == i, indexer.value() + ' ' + i);
	if (i == 35)
		assert(indexer.hasNext() == false);
	indexer.next();
}