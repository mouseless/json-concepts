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
 * CustomTypeData represents a variable custom type.
 * 
 * @typedef {Object} CustomTypeData
 * @property {String} name Name of type
 * @property {validate} validate Validate function to validate a value
 * @property {TypeData|CustomTypeData} base Base type of this custom type
 * @property {TypeData} _root Root type of this custom type
 * @property {import('./validators').ValidatorObject} _validator Validator
 * object.
 */

/**
 * @type {Object.<string, TypeData>}
 */
const BuiltInTypes = Object.freeze({
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
 * Creates custom types from definitions.
 * 
 * @param {Object} definitions (Required) Definition object of custom types
 * 
 * @returns {Object.<string, TypeData>}
 */
function createTypes(definitions = required('definitions')) {
    /** @type {Object.<string, CustomTypeData>} */
    const result = {};

    Object.setPrototypeOf(result, BuiltInTypes);

    for (const name in definitions) {
        result[name] = {
            name: name,
            validate: _validateCustomType,
            _validator: createValidator(definitions[name])
        };
    }

    for (const name in definitions) {
        const type = result[name];

        const base = type._validator.type ? type._validator.type : 'any';
        if (!result[base]) {
            throw error.Concepts_definition_is_not_valid__because__REASON(
                because => because.Unknown_type_TYPE(base)
            );
        }

        type.base = result[base];
    }

    for (const name in definitions) {
        const type = result[name];

        type._root = _findRoot(type);
    }

    for (const name in definitions) {
        const type = result[name];

        type._validator.validateRootType(type._root.name);

        Object.freeze(type);
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
    if (!this._validator.isValid(value)) {
        throw error.Schema_definition_is_not_valid__because__REASON(
            because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
        );
    }

    try {
        this.base.validate(value);
    } catch {
        throw error.Schema_definition_is_not_valid__because__REASON(
            because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
        );
    }
}

/**
 * @param {TypeData|CustomTypeData} type 
 * @param {Object.<String,Boolean>} hit 
 * 
 * @returns {TypeData}
 */
function _findRoot(
    type = required('type'),
    hit = {}
) {
    if (type._root) {
        return type._root;
    }

    if (type.base) {

        hit[type.name] = true;

        if (hit[type.base.name]) {
            throw error.Concepts_definition_is_not_valid__because__REASON(
                because => because.TYPE_cannot_inherit_from_BASE__it_would_cause_a_circular_dependency(
                    type.name, type.base.name
                )
            );
        }

        return _findRoot(type.base, hit);
    }

    return type;
}

module.exports = {
    BuiltInTypes,
    createTypes
};

const { createValidator } = require('./validators');
const { error, required } = require('./util');
