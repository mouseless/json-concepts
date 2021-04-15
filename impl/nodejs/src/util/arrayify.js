function get(
    source = required('source'),
    key = required('key')
) {
    if (!source.hasOwnProperty(key)) {
        return [];
    }

    if (!Array.isArray(source[key])) {
        return [source[key]];
    }

    return source[key];
}

/**
 *  
 * @param {Object} source 
 * @param {String} key 
 * @param {Object} value 
 */
function pushOrSet(
    source = required('source'),
    key = required('key'),
    value = required('value')
) {
    if (!source.hasOwnProperty(key)) {
        source[key] = value;
    } else {
        if (!Array.isArray(source[key])) {
            source[key] = [source[key]];
        }

        source[key].push(value);
    }
}

module.exports = {
    get,
    pushOrSet
};

const { required } = require("./required");