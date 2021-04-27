/**
 * Gets data at given key from source as an array. This function returns is
 * guaranteed to return an array. If key does not exist in source, then an
 * empty array is returned.
 * 
 * @param {Object} source (Required) The object to retrieve data from
 * @param {String} key (Required) Key of data to retrieve
 * 
 * @returns {Array.<Object>} Data at source[key] as an array
 */
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
 * Pushes given value to the key of given source. If there is already an object
 * at source[key] than it becomes an array with an old and the new value after
 * this function. First push does not create an array, instead it directly sets
 * given value to source[key].
 *  
 * @param {Object} source (Required) The object to push data to
 * @param {String} key (Required) Key of data to be pushed
 * @param {Object} value (Required) The data to be pushed
 */
function push(
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

/**
 * Calculates array dimensions of given value. Returns 0 if given value is not
 * an array.
 * 
 * @param {*} value Any value to calculate its dimensions
 * 
 * @returns {Number} Number of dimensions
 */
function dimensions(value = null) {
    let result;

    for (result = 0; Array.isArray(value); result++) {
        if (value.length <= 0) {
            result++;
            break;
        }

        value = value[0];
    }

    return result;
}

module.exports = {
    get,
    push,
    dimensions
};

const { required } = require("./validation");