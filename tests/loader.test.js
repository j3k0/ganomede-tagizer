'use strict';

const assert = require('assert');
const td = require('testdouble');
const tagizer = require('../index');
const directoryClientDouble = require('./directory-client.double');

// test data
const req_id = '1232';
const tag = 'goodtag';
const name = 'name';
const username = 'Loic007';
const badtag = 'badtag';

process.env.LOG_LEVEL = 'fatal';

describe('tagizer.loader', () => {

  let directoryClient, callback, req;

  beforeEach(() => {
    callback = td.function('callback');
    directoryClient = directoryClientDouble({
      username, name, tag, req_id});
    req = {
      id: () => req_id,
      log: td.object(['warn']),
    };
  });

  it('is a function that returns a function', () => {
    assert.equal(typeof tagizer.loader, 'function');
    assert.equal(typeof tagizer.loader(), 'function');
  });

  it('loads the user account', () => {
    const loader = tagizer.loader(directoryClient);
    loader(req, tag, callback);
    td.verify(callback({username, name, tag}));
  });

  it('loads a "identity" account on failure', () => {
    const loader = tagizer.loader(directoryClient);
    loader(req, badtag, callback);
    td.verify(callback({
      username: badtag,
      name: badtag,
      tag: badtag
    }));
  });
});
