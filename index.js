'use strict';

const replacements = [
  {
    pattern: /0/g,
    replacement: 'o'
  },

  {
    pattern: /[l,1]/g,
    replacement: 'i'
  }
];

const tagizer = (s) => {
  if (typeof s !== 'string')
    return undefined;

  return replacements.reduce((str, {pattern, replacement}) => {
    return str.replace(pattern, replacement);
  }, s.toLowerCase());
};

module.exports = tagizer;
