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

## Tag mode

### Middleware

```js
var tagizer = require('ganomede-tagizer');

var tagParam = tagizer.middleware('params', 'tag');
router.get('/blah/:tag', tagParam, getBlah);

var tagBody  = tagizer.middleware('body', 'username');
router.post('/login', tagBody, login);
```

See `lib/save-account-in-request.js` for the full list of fields it exposes and/or overrides.

Default behavior is to read environment variables:

 * `DIRECTORY_PORT_8000_TCP_[ADDR|PORT|PROTOCOL]` - for setting up a connection with a directory client.
 *  `TAG_MODE` - only enable if it's a non-empty string

Default behavior can be overridden by sending a third argument to the `tagizer.middleware` function, with fields:

 * `host`, `port`, `protocol` - for ganomede-directory connection
 * `force` - to enable tag-mode regardless of `TAG_MODE` env

 ```js
var tagBody  = tagizer.middleware('body', 'username', {
  host: 'localhost',
  port: 8000,
  protocol: 'http',
  force: true
});
```

### Account Loader

```js
var tagizer = require('ganomede-tagizer');
var loader = tagizer.loader();
loader(req, 'ada12', (account) => {
  console.log(`user ada12 should be displayed as #{account.name}`);
});
```

`tagizer.loader` also accepts an object with the `host`, `port`, `protocol` and `force` fields, with similar meaning as the middleware. When not specified, environment variables will be used.
