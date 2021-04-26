/**
 * Validates given value against type, and throws error if value is not valid.
 * 
 * @callback validate
 * @param {Number|String|Boolean} value Value to validate
 * 
 * @returns {void}
 */
/**
 * TypeData represents a variable type.
 * 
 * @typedef {Object} TypeData
 * @property {String} name Name of type
 * @property {validate} validate Validate function to validate a value
 */

/**
 * @type {Object.<string, TypeData>}
 */
const DefaultTypes = Object.freeze({
    'any': {
        name: 'any',
        validate: _validateAny
    },
    'boolean': {
        name: 'boolean',
        validate: _validateBuiltInType
    },
    'number': {
        name: 'number',
        validate: _validateBuiltInType
    },
    'string': {
        name: 'string',
        validate: _validateBuiltInType
    },
});

/**
 * Creates custom types from definitions.
 * 
 * @param {Object} definitions (Required) Definition object of custom types
 * 
 * @returns {Object.<string, TypeData>}
 */
function createTypes(definitions = required('definitions')) {
    /** @type {Object.<string, TypeData>} */
    const result = {};

    Object.setPrototypeOf(result, DefaultTypes);

    for (const type in definitions) {
        result[type] = {
            name: type,
            validate: _validateCustomType,
            definition: definitions[type],
            types: result
        }
    }

    for (const type in definitions) {
        const customType = result[type];

        if (customType.definition.type && !result[customType.definition.type]) {
            throw error.Unknown_type_TYPE(customType.definition.type);
        }
    }

    return result;
}

/**
 * @param {Number|String|Boolean} value 
 */
function _validateAny(value) { }

/**
 * @param {Number|String|Boolean} value
 */
function _validateBuiltInType(value) {
    if (typeof value !== this.name) {
        throw error.Schema_definition_is_not_valid__because__REASON(
            because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
        );
    }
}

/**
 * @param {Number|String|Boolean} value 
 */
function _validateCustomType(value) {
    /** @type {TypeData} */
    let base = this.types['any'];

    if (this.definition.type !== undefined) {
        base = this.types[this.definition.type];
    }

    try {
        base.validate(value);
    } catch {
        throw error.Schema_definition_is_not_valid__because__REASON(
            because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
        );
    }
}

module.exports = {
    DefaultTypes,
    createTypes
};

const { error, required } = require('./util');
