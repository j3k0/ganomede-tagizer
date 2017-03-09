'use strict';

const assert = require('assert');
const td = require('testdouble');
const directoryClientDouble = require('./directory-client.double');
const middleware = require('../index').middleware;

const req_id = '1232';
const tag = 'goodtag';
const username = 'Loic007';
const badtag = 'badtag';
process.env.LOG_LEVEL = 'fatal';

describe('tagizer.middleware', () => {

  let directoryClient, req, res, next;

  beforeEach(() => {
    directoryClient = directoryClientDouble({
      username, tag, req_id});
    req = {
      log: td.object(['warn']),
      id: () => req_id,
      params: {'tag': tag, 'badtag': badtag},
      body: {'username': tag}
    };
    next = td.function('next');
  });

  it('is a function that returns a function', () => {
    assert.equal(typeof middleware, 'function');
    assert.equal(typeof middleware(), 'function');
  });

  it('reads the requests specified field and asks directory', () => {
    const mw = middleware('params', 'tag', directoryClient);
    mw(req, res, next);
    td.verify(next());
    assert.equal(username, req.params.username);
  });

  it('reads the requests specified field and asks directory', () => {
    const mw = middleware('body', 'username', directoryClient);
    mw(req, res, next);
    td.verify(next());
    assert.equal(username, req.body.username);
  });

  it('sets username as tag in case of failure', () => {
    const mw = middleware('params', 'badtag', directoryClient);
    mw(req, res, next);
    td.verify(next());
    assert.equal(badtag, req.params.username);
  });
});
