/**
 * Throws 'Parameter is required` error. Use this only as a default value, so
 * that it will give error when no value was given to a parameter.
 * 
 * @param {String} name (Required) Name of the parameter
 * 
 * @private
 */
function required(name = required('name')) {
    throw error.PARAMETER_is_required(name);
}

/**
 * Checks type of an object against given type and throws error if object does
 * not satisfy this type expectation.
 * 
 * @param {Object} object (Required) Object whose type is to be checked
 * @param {String} type (Required) Expected type
 * 
 * @private
 */
function checkType(
    object = required('object'),
    type = required('type')
) {
    if (typeof object !== type) {
        throw error.Expected_type_was_EXPECTED_got_ACTUAL(type, typeof object);
    }
}

module.exports = {
    required,
    checkType
};

const error = require('./error');
