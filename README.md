# ganomede-tagizer

The mighty tagizer of ganomede usernames.

## Tag function

```js
var tagizer = require('ganomede-tagizer').tag;
tag('p0lO') === tag('pO10');
typeof tag('abcdef') === 'string';
```

The goal of the tag function is to generate a non-visually ambiguous version of a username. You know, sometimes people confuse a 0 and a O, these sort of things.

This module exposes a single function that, given a username, returns a string: a "tag". Compare 2 tags generated from 2 usernames: if they are equal, it means the usernames look similar on screen.

In my use case, I make sure username's "tags" are globally unique in our users database, preventing confusingly similar-looking usernames to co-exist. A database search by username will search by tag: which should always return a single or no result.

## Tag-mode Middleware

**Signature**: `tagizer.middlerware(field, subfield, options = {})`

**Return value**: a middleware for restify

The created middleware will extend `req.params` with the following:

   - `req.params.username = account.id`
   - `req.params.user.username = account.id`
   - `req.params.user.tag = account.aliases.tag`
   - `req.params.user.name = account.aliases.name`
   - `req.params.user.email = account.aliases.email`

It also sets `req[field].username = account.id`

**Example**

```js
var tagizer = require('ganomede-tagizer');

var tagParam = tagizer.middleware('params', 'tag');
router.get('/blah/:tag', tagParam, getBlah);

var tagBody  = tagizer.middleware('body', 'username');
router.post('/login', tagBody, login);
```

**Connection with ganomede-directory**

The default behavior is to read environment variables:

 * `DIRECTORY_PORT_8000_TCP_[ADDR|PORT|PROTOCOL]` - for setting up a connection with a directory client.
 *  `TAG_MODE` - only enable if it's a non-empty string

This behavior can be overridden by filling `options`, the third argument of the `tagizer.middleware` function, with fields:

 * `host`, `port`, `protocol` - for ganomede-directory connection
 * `force` - to enable tag-mode regardless of `TAG_MODE` environment variable

**Example**

 ```js
var tagBody  = tagizer.middleware('body', 'username', {
  host: 'localhost',
  port: 8000,
  protocol: 'http',
  force: true
});
```

**Notes**

When tag-mode is disabled or fetching the account isn't possible, the middleware sets:

 - `req.params.username = tag`
 - `req.params.user.username = tag`
 - `req[field].username = tag`

## Tag-mode Account Loader

**Signature**: `tagizer.loader(options)`

**Return value**: an account loader function

The account loader function takes a `tag`, `name` or `id` and return an object with fields: `username`, `tag` and `name`.

**Arguments**:

`tagizer.loader` also accepts an `option` object with the `host`, `port`, `protocol` and `force` fields, with similar meaning as the middleware. When not specified, the same environment variables will be used.

**Example**

```js
var tagizer = require('ganomede-tagizer');
var loader = tagizer.loader();
loader(req, 'ada12', (account) => {
  console.log(`user ada12 should be displayed as #{account.name}`);
});
```

**Notes**

If tag-mode isn't enabled or retrieving the user failed, account will be set to:

 - `account.username = tag`
 - `account.tag = tag`
 - `account.name= tag`

## Copyright

(c)2017, Fovea
