/**
 * Finds returns all objects that matches given path or paths.
 * 
 * @param {Object} target Object to search
 * @param {String|Array.<String>} pathOrPaths Path(s) to find
 * 
 * @returns {Array.<Object>} Found objects at path(s)
 */
function find(target, pathOrPaths) {
    /** @type {Array.<String>} */
    const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];

    const result = [];
    const index = _index(target);

    for (const wildcard of paths) {
        const regex = _regex(wildcard);

        for (const path in index) {
            if (regex.test(path)) {
                result.push(index[path]);
            }
        }
    }

    return result;
}

/**
 * @param {Object} object
 * 
 * @returns {Object.<string, Object>}
 */
function _index(
    object = required('object'),
    _result = {},
    _base = ''
) {
    if (typeof object !== 'object') {
        return _result;
    }

    for (const key in object) {
        const name = Expression.parseName(key);
        _result[_base + '/' + name] = object[key];

        _index(object[key], _result, _base + '/' + name);
    }

    return _result;
}

/**
 * @param {String} wildcard 
 * 
 * @returns {RegExp}
 */
function _regex(wildcard) {
    const pattern = wildcard
        .replace(/\*\*\//g, '[a-zA-Z0-9$_\\-\\/]{0,}')
        .replace(/\*\*/g, '[a-zA-Z0-9$_\\-\\/]{0,}')
        .replace(/\*/g, '[a-zA-Z0-9$_\\-]{0,}')
        .replace(/\$/g, '\\$')
        .replace(/\//g, '\\/');

    return new RegExp(`^${pattern}$`, 'g');
}

module.exports = {
    find
};

const Expression = require('./expression');
const { required } = require('./util');
