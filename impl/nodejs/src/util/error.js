/**
 * Names of errors to be thrown from this module.
 * 
 * @enum {String}
 */
const Names = {
    /** Schema validation errors */
    SCHEMA_ERROR: 'SchemaError',
    /** Other errors */
    ERROR: 'Error'
}

/**
 * Reason messages for invalid concepts.
 */
const InvalidConceptsReasons = {
    LITERAL_cannot_have_QUANTIFIER: (LITERAL, QUANTIFIER) => `'${LITERAL}' cannot have '${QUANTIFIER}' quantifier`
};

/**
 * Reason messages for invalid schemas.
 */
const InvalidSchemaReasons = {
    CONCEPT_is_missing: CONCEPT => `'${CONCEPT}' is missing`,
    LITERAL_is_missing: LITERAL => `'${LITERAL}' is missing`,
    Expected_LITERAL__but_got_VALUE: (LITERAL, VALUE) => `Expected '${LITERAL}', but got '${VALUE}'`,
    TOKEN_is_not_expected: TOKEN => `'${TOKEN}' is not expected`,
    Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT:
        (CONCEPT, MIN, COUNT) => `Minimum allowed number of '${CONCEPT}' is ${MIN}, but got ${COUNT}`,
    Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT:
        (CONCEPT, MAX, COUNT) => `Maximum allowed number of '${CONCEPT}' is ${MAX}, but got ${COUNT}`,
    VALUE_is_not_a_valid_TYPE: (VALUE, TYPE) => `'${VALUE}' is not a valid ${TYPE}`
}

/**
 * Builds reason message for given concepts name.
 * 
 * @callback invalidTransformationReasonBuilder
 * @param {String} concepts Name of concepts
 * 
 * @returns {String} Reason message
 */
/**
 * Reason message builders for invalid transformations.
 */
const InvalidTransformationReasons = {
    /**
     * @returns {invalidTransformationReasonBuilder}
     */
    CONCEPT_not_found: CONCEPT => CONCEPTS => `Concept named '${CONCEPT}' is not found in ${CONCEPTS} concepts`,
    /**
     * @returns {invalidTransformationReasonBuilder}
     */
    VARIABLE_not_found: VARIABLE => CONCEPTS => `Variable named '${VARIABLE}' is not found in ${CONCEPTS} concepts`,
}

function _error(message, name = Names.ERROR) {
    const result = new Error(message);

    result.name = name;

    return result;
}

module.exports = {
    Names,
    PARAMETER_is_required(PARAMETER) {
        return _error(`${PARAMETER} is required`);
    },
    Expected_type_was_EXPECTED_got_ACTUAL(EXPECTED, ACTUAL) {
        return _error(`Expected type was '${EXPECTED}', got '${ACTUAL}'`);
    },
    FILE_is_not_a_valid_json(FILE) {
        return _error(`'${FILE}' is not a valid json`);
    },
    Cannot_load_URL(URL) {
        return _error(`Cannot load '${URL}'`);
    },
    Cannot_load_FILE(FILE) {
        return _error(`Cannot load '${FILE}'`);
    },
    Concepts_required_to_load_SCHEMA(SCHEMA) {
        return _error(
            `Concepts required to load ${SCHEMA}.` +
            ` Either specify @concepts meta-data within ${SCHEMA}, or pass concepts as a parameter.`
        );
    },
    Cannot_parse_quantifier__EXPRESSION(EXPRESSION) {
        return _error(`Cannot parse quantifier: ${EXPRESSION}`)
    },
    Cannot_parse_EXPRESSION__type_expected(EXPRESSION) {
        return _error(`Cannot parse '${EXPRESSION}', type expected.`)
    },
    Unknown_type_TYPE_in_EXPRESSION(TYPE, EXPRESSION) {
        return _error(`Unknown type '${TYPE}' in '${EXPRESSION}`);
    },
    /**
     * Selects reason from given reasons.
     * 
     * @callback invalidConceptsReasonCallback
     * @param {InvalidConceptsReasons}
     * 
     * @returns {String}
     */
    /**
     * @param {invalidConceptsReasonCallback} REASON 
     * 
     * @returns {Error} SchemaError
     */
    Concepts_definition_is_not_valid__because__REASON(REASON) {
        return _error(
            `Concepts definition is not valid: ${REASON(InvalidConceptsReasons)}`,
            Names.SCHEMA_ERROR
        );
    },
    CONCEPTS_is_not_valid__Error_is__ERROR(CONCEPTS, ERROR) {
        return _error(`'${CONCEPTS}' is not valid. Error is: ${ERROR}`, Names.SCHEMA_ERROR);
    },

    /**
     * Selects reason from given reasons.
     * 
     * @callback invalidSchemaReasonCallback
     * @param {InvalidSchemaReasons}
     * 
     * @returns {String}
     */
    /**
     * @param {invalidSchemaReasonCallback} REASON 
     * 
     * @returns {Error} SchemaError
     */
    Schema_definition_is_not_valid__because__REASON(REASON) {
        return _error(
            `Schema definition is not valid: ${REASON(InvalidSchemaReasons)}.`,
            Names.SCHEMA_ERROR
        );
    },
    SCHEMA_is_not_valid__Error_is__ERROR(SCHEMA, ERROR) {
        return _error(`'${SCHEMA}' is not valid. Error is: ${ERROR}`, Names.SCHEMA_ERROR);
    },
    /**
     * Selects reason from given reasons.
     * 
     * @callback invalidTransformationReasonCallback
     * @param {InvalidTransformationReasons} reasons Reason builder
     * 
     * @returns {invalidTransformationReasonBuilder}
     */
    /**
     * @param {String} CONCEPTS 
     * @param {invalidTransformationReasonCallback} REASON 
     * 
     * @returns {Error} SchemaError
     */
    Definition_is_not_compatible_with_its_CONCEPTS__because__REASON(CONCEPTS, REASON) {
        return _error(
            `Definition is not compatible with its ${CONCEPTS}: ` +
            `${REASON(InvalidTransformationReasons)(CONCEPTS)}`,
            Names.SCHEMA_ERROR
        );
    },
    TRANSFORMATION_is_not_valid__Error_is__ERROR(TRANSFORMATION, ERROR) {
        return _error(`'${TRANSFORMATION}' is not valid. Error is: ${ERROR}`, Names.SCHEMA_ERROR);
    }
};

const SC = require('./special-characters');