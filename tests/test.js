'use strict';

const assert = require('assert');
const tag = require('../index').tag;

describe('tagizer.tag', () => {

  it('is a function from string to string', () => {
    assert.equal(typeof tag, 'function');
    assert.equal(typeof tag('abcdef'), 'string');
  });

  it('is undefined when input is not a string', () => {
    assert.strictEqual(tag(null), undefined);
    assert.strictEqual(tag(undefined), undefined);
  });

  it('does not change the length of the input string', () => {
    assert.strictEqual(tag(''), '');
    assert.equal(tag('123456').length, 6);
  });

  it('equalizes similarly looking charaters', () => {
    assert.equal(tag('0'), tag('O'));
    assert.equal(tag('o'), tag('O'));
    assert.equal(tag('A'), tag('a'));
  });

  it('does so for longuer strings', () => {
    assert.equal(tag('p0lO'), tag('pO10'));
    assert.equal(tag('NamilleX07'), 'namiiiexo7');
  });

});
