var tagizer = function(s) {
    if (typeof s !== 'string')
        return undefined;
    return s
        .toLowerCase()
        .replace('0', 'o')
        .replace('l', 'i')
        .replace('1', 'i');
}

module.exports = tagizer;
