/**
 * Finds and returns all objects that matches given path or paths.
 * 
 * @param {Object} target Object to search
 * @param {String|Array.<String>} pathOrPaths Path(s) to find
 * 
 * @returns {Array.<Object>} Found objects at path(s)
 * 
 * @private
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
 * 
 * @private
 */
function _index(
    object = required('object'),
    _result = {},
    _base = '',
    _trace = new Set()
) {
    if (_trace.has(object)) {
        return _result;
    }

    _trace.add(object);

    if (typeof object !== 'object') {
        return _result;
    }

    if (Array.isArray(object) && object.length > 0) {
        object = object[0];
    }

    _result[_base] = object;

    for (const key in object) {
        const name = Expression.parseName(key);

        _index(object[key], _result, _base + '/' + name, _trace);
    }

    return _result;
}

/**
 * @param {String} wildcard 
 * 
 * @returns {RegExp}
 * 
 * @private
 */
function _regex(wildcard) {
    if (wildcard == '/') {
        wildcard = '';
    }

    const pattern = wildcard
        .replace(/\$/g, '\\$')
        .replace(/\/\*\*/g, '.{0,}')
        .replace(/\*\*/g, '.{0,}')
        .replace(/\//g, '\\/')
        .replace(/\*/g, '[^\\/]{0,}');


    return new RegExp(`^${pattern}$`);
}

module.exports = {
    find
};

const Expression = require('./expression');
const { required } = require('./util');
