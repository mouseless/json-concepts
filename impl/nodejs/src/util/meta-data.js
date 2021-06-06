/**
 * Check if meta-data exists on an object.
 * 
 * @param {Object} obj Object to check meta-data on
 * @param {String} name Name of the meta-data to check
 * 
 * @returns {boolean} `true` if it exists, `false` otherwise
 */
function exists(
    obj = required('obj'),
    name = required('name')
) {
    return obj[_key(name)];
}

/**
 * Reads meta-data from an object.
 * 
 * @param {Object} obj (Required) Object to get meta-data from
 * @param {String} name (Required) Name of the meta-data to get
 * @param {boolean} burnAfterReading (Default: `false`) When set to `true` it
 * deletes the meta-data after reading.
 * 
 * @returns {Object} meta-data as an object or `null` if does not exist
 */
function read(
    obj = required('obj'),
    name = required('name'),
    burnAfterReading = false
) {
    if (!exists(obj, name)) {
        return null;
    }

    const result = obj[_key(name)];

    if (burnAfterReading) {
        burn(obj, name);
    }

    return result;
}

/**
 * Deletes meta-data from object.
 * 
 * @param {Object} obj (Required) Object to delete meta-data from
 * @param {String} name (Required) Name of the meta-data to delete
 */
function burn(
    obj = required('obj'),
    name = required('name')
) {
    delete obj[_key(name)];
}

function _key(name = required('name')) {
    return `${SC.META_DATA}${name}`;
}

module.exports = {
    exists,
    read,
    burn
};

const SC = require('./special-characters');
const { required } = require('./validation');
