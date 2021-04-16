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
    return obj.hasOwnProperty(SpecialCharacters.META_DATA.decorate(name));
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

    const metaDataKey = SpecialCharacters.META_DATA.decorate(name);
    const result = obj[metaDataKey];

    if (burnAfterReading) {
        delete obj[metaDataKey];
    }

    return result;
};

module.exports = {
    exists,
    read
};

const { SpecialCharacters } = require('./special-characters');
const { required } = require('./validation');
