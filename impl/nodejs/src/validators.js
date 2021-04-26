/**
 * Validates if given base type is supported by this validator, throws error if
 * base type is not supported.
 * 
 * @callback validateBaseType
 * @param {String} base Base type name to check
 */
/**
 * Checks if given value is valid according to this validator.
 * 
 * @callback isValid
 * @param {Number|String|Boolean} value Value to validate
 * 
 * @returns {Boolean} `true` if valid, `false` otherwise 
 */
/**
 * Represents validator object built specifically for a defined custom type.
 * 
 * @typedef {Object} ValidatorObject
 * @property {String} type Base type of custom type
 * @property {validateBaseType} validateBaseType
 * @property {isValid} isValid
 */

/**
 * @callback test
 * @param {*} definition
 * @param {Number|String|Boolean} value
 */
/**
 * @type {Object.<string,{validTypes:Array.<string>,test:test}>}
 */
const _validators = {
    regex: {
        validTypes: ['string'],
        test: (pattern, value) => new RegExp(pattern).test(value)
    }
};

/**
 * Creates a validator using given custom type definition.
 * 
 * @param {Object|Array|String} definition (Required) Custom type definition
 * 
 * @returns {ValidatorObject} Validator object for given definition
 */
function createValidator(definition = required('definition')) {
    if (typeof definition === 'string' &&
        definition.startsWith('/') &&
        definition.endsWith('/g')
    ) {
        definition = {
            type: "string",
            regex: definition
        };
    }

    if (typeof definition !== 'object') {
        throw error.Concepts_definition_is_not_valid__because__REASON(
            because => because.Cannot_create_a_validator_from_EXPRESSION(definition)
        )
    }

    const result = {
        type: definition.type,
        _validations: [],
        validateBaseType: _validateBaseType,
        isValid: _isValid
    };

    for (const validator in definition) {
        if (validator === 'type') { continue; }

        if (!_validators[validator]) {
            throw error.Concepts_definition_is_not_valid__because__REASON(
                because => because.VALIDATOR_does_not_exist(validator)
            );
        }

        result._validations.push({
            name: validator,
            validator: _validators[validator],
            definition: definition[validator]
        });
    }

    return result;
}

/**
 * @param {String} base 
 */
function _validateBaseType(base) {
    for (const validation of this._validations) {
        if (!validation.validator.validTypes.includes(base)) {
            throw error.Concepts_definition_is_not_valid__because__REASON(
                because => because.VALIDATOR_does_not_support_TYPE(
                    validation.name, base
                )
            );
        }
    }
}

/**
 * @param {Number|String|Boolean} value 
 * 
 * @returns {Boolean}
 */
function _isValid(value) {
    for (const validation of this._validations) {
        if (!validation.validator.test(validation.definition, value)) {
            return false;
        }
    }

    return true;
}

module.exports = {
    createValidator,
};

const { error, required } = require('./util');