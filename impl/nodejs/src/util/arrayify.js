/**
 * Pulls (but not removes) data at given key from source as an array. This
 * function is guaranteed to return an array. If key does not exist in source,
 * then an empty array is returned.
 * 
 * @param {Object} source (Required) The object to pull data from
 * @param {String} key (Required) Key of data to pull
 * 
 * @returns {Array.<Object>} Data at source[key] as an array
 * 
 * @private
 */
function pull(
    source = required('source'),
    key = required('key')
) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
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
 * 
 * @private
 */
function push(
    source = required('source'),
    key = required('key'),
    value = required('value')
) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) {
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
 * 
 * @private
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

/**
 * Creates an n dimensional array using given value. If given value is already
 * an array with desired or more number of dimensions, it returns value as is.
 * 
 * @param {Number} dimensions Number of desired dimensions
 * @param {*} value Any value to make a n dimensional array
 * 
 * @returns {Array} An n dimensional array
 * 
 * @private
 */
function make(
    dimensions = 0,
    value = null
) {
    dimensions = dimensions - this.dimensions(value);

    for (let i = 0; i < dimensions; i++) {
        if (value == null) {
            value = [];
        } else {
            value = [value];
        }
    }

    return value;
}

/**
 * @param {Array} array 
 * @param {Array.<Number>|Number} indices 
 * @param {*} value 
 * 
 * @private
 */
function set(
    array = required('array'),
    indices,
    value
) {
    if (!Array.isArray(indices)) {
        indices = [indices];
    }

    for (let i = 0; i < indices.length - 1; i++) {
        const ix = indices[i];
        if (array[ix] == null) {
            array[ix] = [];
        }
        array = array[ix];
    }

    array[indices[indices.length - 1]] = value;
}

/**
 * Action callback to be called for every item in an n dimensional array.
 * 
 * @callback eachAction
 * @param {*} item An item in n dimensional array
 * @param {Array.<Number>} indices Indices of this item
 * 
 * @private
 */
/**
 * Iterates through an n dimensional array, and perform given action for every
 * item. If value is not an array, it simply performs given action on value.
 * 
 * @param {*} value Value to iterate
 * @param {eachAction} action (Required) Action to perform
 * 
 * @private
 */
function each(
    value,
    action = required('action'),
    _indices = []
) {
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            const item = value[i];

            each(item, action, _indices.concat([i]));
        }
    } else {
        action(value, _indices);
    }
}

module.exports = {
    pull,
    push,
    dimensions,
    make,
    set,
    each
};

const { required } = require('./validation');
