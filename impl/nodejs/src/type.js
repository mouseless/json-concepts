/**
 * Validates given value against type, and throws error if value is not valid.
 * 
 * @callback validate
 * @param {*} value Value to validate
 */
/**
 * TypeData represents a variable type.
 * 
 * @typedef {Object} TypeData
 * @property {String} name Name of type
 * @property {validate} validate Validate function to validate a value
 */

/**
 * Available types.
 * 
 * @enum {TypeData}
 */
const Types = {
    'any': {
        name: 'any',
        validate: _alwaysValid
    },
    'boolean': {
        name: 'boolean',
        validate: _validateByType
    },
    'number': {
        name: 'number',
        validate: _validateByType
    },
    'string': {
        name: 'string',
        validate: _validateByType
    },
}

/**
 * @param {*} value 
 */
function _alwaysValid(value) { }

/**
 * @param {*} value
 */
function _validateByType(value) {
    if (typeof value !== this.name) {
        throw error.Schema_definition_is_not_valid__because__REASON(
            because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
        );
    }
}

module.exports = Types;

const { error } = require('./util');