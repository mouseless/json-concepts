/**
 * Validates given value against type, and throws error if value is not valid.
 * 
 * @callback validate
 * @param {Number|String|Boolean} value Value to validate
 * 
 * @returns {void}
 * 
 * @private
 */
/**
 * TypeData represents a variable type.
 * 
 * @typedef {Object} TypeData
 * @property {String} name Name of type
 * @property {Boolean} implicit `true` if type is implicitly any, `false`
 * otherwise.
 * @property {TypeData} root Self reference
 * @property {validate} validate Validate function to validate a value
 * 
 * @private
 */
/**
 * CustomTypeData represents a variable custom type.
 * 
 * @typedef {Object} CustomTypeData
 * @property {String} name Name of type
 * @property {TypeData} root Root type of this custom type
 * @property {validate} validate Validate function to validate a value
 * @property {TypeData|CustomTypeData} base Base type of this custom type
 * @property {import('./validators').ValidatorObject} _validator Validator
 * object.
 * 
 * @private
 */

/**
 * @type {Object.<string, TypeData>}
 * 
 * @private
 */
const _builtInTypes = Object.freeze({
    implicit: _builtInType('any', _validateAny, /* implicit */ true),
    any: _builtInType('any', _validateAny),
    boolean: _builtInType('boolean', _validateType),
    number: _builtInType('number', _validateType),
    string: _builtInType('string', _validateType)
});

/**
 * Creates custom types from definitions.
 * 
 * @param {Object} definitions (Required) Definition object of custom types
 * 
 * @returns {Object.<string, TypeData>}
 * 
 * @private
 */
function createTypes(definitions = required('definitions')) {
    /** @type {Object.<string, CustomTypeData>} */
    const result = {};

    Object.setPrototypeOf(result, _builtInTypes);

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
            throw error.Concepts_definition_is_not_valid__REASON(
                because => because.Unknown_type_TYPE(base)
            );
        }

        type.base = result[base];
    }

    for (const name in definitions) {
        const type = result[name];

        type.root = _findRoot(type);
    }

    for (const name in definitions) {
        const type = result[name];

        type._validator.validateRoot(type.root.name);

        Object.freeze(type);
    }

    return Object.freeze(result);
}

/**
 * @param {String} name 
 * @param {validate} validate 
 * 
 * @returns {TypeData}
 * 
 * @private
 */
function _builtInType(
    name = required('name'),
    validate = required('validate'),
    implicit = false
) {
    const result = {
        name: name,
        implicit: implicit,
        validate: validate
    };

    result.root = result;

    return Object.freeze(result);
}

/**
 * @param {Number|String|Boolean} value 
 * 
 * @private
 */
function _validateAny(value) {
    if (value != null && typeof value == 'object') {
        throw error.Schema_definition_is_not_valid__REASON(
            because => because.Object_not_expected(value)
        );
    }
}

/**
 * @private
 * 
 * @param {Number|String|Boolean} value
 */
function _validateType(value) {
    if (typeof value !== this.name) {
        throw error.Schema_definition_is_not_valid__REASON(
            because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
        );
    }
}

/**
 * @param {Number|String|Boolean} value
 * 
 * @private
 */
function _validateCustomType(value) {
    if (!this._validator.isValid(value)) {
        throw error.Schema_definition_is_not_valid__REASON(
            because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
        );
    }

    try {
        this.base.validate(value);
    } catch {
        throw error.Schema_definition_is_not_valid__REASON(
            because => because.VALUE_is_not_a_valid_TYPE(value, this.name)
        );
    }
}

/**
 * @param {TypeData|CustomTypeData} type 
 * @param {Object.<String,Boolean>} hit 
 * 
 * @returns {TypeData}
 * 
 * @private
 */
function _findRoot(
    type = required('type'),
    hit = {}
) {
    if (type.root) {
        return type.root;
    }

    if (type.base) {

        hit[type.name] = true;

        if (hit[type.base.name]) {
            throw error.Concepts_definition_is_not_valid__REASON(
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
    createTypes
};

const { createValidator } = require('./validators');
const { error, required } = require('./util');
