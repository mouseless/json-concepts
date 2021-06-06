/**
 * Validates if given type is supported by this validator, throws error if type
 * is not supported.
 * 
 * @callback validateRoot
 * @param {String} root Type to check
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
 * @property {validateRoot} validateRoot
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
        test: (pattern, value) => new RegExp(pattern, 'g').test(value)
    },
    enum: {
        validTypes: ['string', 'number', 'boolean', 'any'],
        test: (validValues, value) => validValues.includes(value)
    },
    min: {
        validTypes: ['number', 'string'],
        test: (lowerBound, value) => {
            if (typeof value === 'string') {
                value = value.length;
            }

            return value >= lowerBound;
        }
    },
    max: {
        validTypes: ['number', 'string'],
        test: (upperBound, value) => {
            if (typeof value === 'string') {
                value = value.length;
            }

            return value <= upperBound;
        }
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
    if (typeof definition === 'string') {
        definition = {
            type: 'string',
            regex: definition
        };
    }

    if (Array.isArray(definition)) {
        let type = null;
        for (const member of definition) {
            if (type === null) {
                type = typeof member;
            } else if (typeof member !== type) {
                type = 'any';
                break;
            }
        }

        definition = {
            type: type,
            enum: definition
        };
    }

    if (typeof definition !== 'object') {
        throw error.Concepts_definition_is_not_valid__REASON(
            because => because.Cannot_create_a_validator_from_EXPRESSION(definition)
        );
    }

    const result = {
        type: definition.type,
        _validations: [],
        validateRoot: _validateRoot,
        isValid: _isValid
    };

    for (const validator in definition) {
        if (validator === 'type') { continue; }

        if (!_validators[validator]) {
            throw error.Concepts_definition_is_not_valid__REASON(
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
 * @param {String} root 
 */
function _validateRoot(root) {
    for (const validation of this._validations) {
        if (!validation.validator.validTypes.includes(root)) {
            throw error.Concepts_definition_is_not_valid__REASON(
                because => because.VALIDATOR_does_not_support_TYPE(
                    validation.name, root
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