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
    any: Object.freeze({
        name: 'any',
        validate: _validateAny
    }),
    boolean: Object.freeze({
        name: 'boolean',
        validate: _validateBuiltInType
    }),
    number: Object.freeze({
        name: 'number',
        validate: _validateBuiltInType
    }),
    string: Object.freeze({
        name: 'string',
        validate: _validateBuiltInType
    }),
});

/**
 * @callback isValid
 * @param {*} definition
 * @param {Number|String|Boolean} value
 */
/**
 * @type {Object.<string,{validTypes:Array.<string>,isValid:isValid}>}
 */
const _validators = {
    regex: {
        validTypes: ['string'],
        isValid: (pattern, value) => new RegExp(pattern).test(value)
    }
};

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
        const definition = _parseDefinition(definitions[type]);

        result[type] = Object.freeze({
            name: type,
            validate: _validateCustomType,
            _definition: definition,
            _types: result,
            _base: definition.type ? definition.type : 'any'
        });
    }

    for (const definition in definitions) {
        const type = result[definition];

        if (!result[type._base]) {
            throw error.Concepts_definition_is_not_valid__because__REASON(
                because => because.Unknown_type_TYPE(type._base)
            );
        }

        for (const validator in type._definition) {
            if (validator === 'type') { continue; }

            if (!_validators[validator].validTypes.includes(type._base)) {
                throw error.Concepts_definition_is_not_valid__because__REASON(
                    because => because.VALIDATOR_does_not_support_TYPE(
                        validator, type._base
                    )
                );
            }
        }
    }

    return Object.freeze(result);
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
    for (const key in this._definition) {
        if (key === 'type') { continue; }

        if (!_validators[key].isValid(this._definition[key], value)) {
            throw error.Schema_definition_is_not_valid__because__REASON(
                because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
            );
        }
    }

    try {
        this._types[this._base].validate(value);
    } catch {
        throw error.Schema_definition_is_not_valid__because__REASON(
            because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
        );
    }
}

/**
 * @param {Object|Array|String} definition 
 */
function _parseDefinition(definition = required('definition')) {
    if (typeof definition === 'object') {
        return definition;
    }

    if (typeof definition === 'string' &&
        definition.startsWith('/') &&
        definition.endsWith('/g')
    ) {
        return {
            type: "string",
            regex: definition
        };
    }

    throw new Error('unhandled');
}

module.exports = {
    DefaultTypes,
    createTypes
};

const { error, required } = require('./util');
