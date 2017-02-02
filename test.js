const tagizer = require('./index');
const assert = require('assert');

assert.equal(typeof tagizer, 'function');
assert.equal(typeof tagizer('abcdef'), 'string');

assert.strictEqual(tagizer(null), undefined);
assert.strictEqual(tagizer(undefined), undefined);
assert.strictEqual(tagizer(''), '');
assert.equal(tagizer('123456').length, 6);

assert.equal(tagizer('0'), tagizer('O'));
assert.equal(tagizer('o'), tagizer('O'));
assert.equal(tagizer('A'), tagizer('a'));

assert.equal(tagizer('p0lO'), tagizer('pO10'));

assert.equal(tagizer('NamilleX07'), 'namiiiexo7');

console.log("All tests passed!");
