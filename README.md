# ganomede-tagizer

The mighty tagizer of ganomede usernames

```js
var tagizer = require('ganomede-tagizer');
tagizer('p0lO') === tagizer('pO10');
typeof tagizer('abcdef') === 'string';
```

The goal of the tagizer is to generate a non-visually ambiguous version of a username. You know, sometimes people confuse a 0 and a O, these sort of things.

This module exposes a single function that, given a username, returns a string: a "tag". Compare 2 tags generated from 2 usernames: if they are equal, it means the usernames look similar on screen.

In my use case, I make sure username's "tags" are globally unique in our users database, preventing confusingly similar-looking usernames to co-exist. A database search by username will search by tag: which should always return a single or no result.
