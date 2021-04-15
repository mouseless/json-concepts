function get(source, key) {
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
function pushOrSet(source, key, value) {
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