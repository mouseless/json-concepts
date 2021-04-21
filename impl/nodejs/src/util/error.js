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

/**
 * Reason messages for invalid schemas.
 */
const InvalidSchemaReasons = {
    CONCEPT_is_missing: CONCEPT => `'${CONCEPT}' is missing`,
    LITERAL_is_missing: LITERAL => `'${LITERAL}' is missing`,
    Expected_LITERAL__but_got_VALUE: (LITERAL, VALUE) => `Expected '${LITERAL}', but got '${VALUE}'`,
    TOKEN_is_not_expected: TOKEN => `'${TOKEN}' is not expected`,
    Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT:
        (CONCEPT, MAX, COUNT) => `Maximum allowed number of '${CONCEPT}' is ${MAX}, but got ${COUNT}`,
    LITERAL_expects_an_array_for_VARIABLE__but_got_an_instance_of_TYPE:
        (LITERAL, VARIABLE, TYPE) => `'${LITERAL}' expects an array for '${SC.VARIABLE}${VARIABLE}', ` +
            `but got an instance of ${TYPE}`,
    LITERAL_expects_an_array_for_VARIABLE__but_got_null:
        (LITERAL, VARIABLE) => `'${LITERAL}' expects an array for '${SC.VARIABLE}${VARIABLE}', but got null`,
    LITERAL_expects_an_array_for_VARIABLE__but_got_VALUE:
        (LITERAL, VARIABLE, VALUE) => VALUE === null
            ? InvalidSchemaReasons.LITERAL_expects_an_array_for_VARIABLE__but_got_null(
                LITERAL, VARIABLE
            )
            : InvalidSchemaReasons.LITERAL_expects_an_array_for_VARIABLE__but_got_an_instance_of_TYPE(
                LITERAL, VARIABLE, typeof VALUE
            ),
    Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT:
        (CONCEPT, MIN, COUNT) => `Minimum allowed number of '${CONCEPT}' is ${MIN}, but got ${COUNT}`,
    LITERAL_requires_VARIABLE_array_to_have_at_least_MIN_item_s___but_got_COUNT:
        (LITERAL, VARIABLE, MIN, COUNT) => `${LITERAL} requires '${SC.VARIABLE}${VARIABLE}' array ` +
            `to have at least ${MIN} item(s), but got ${COUNT}`,
    LITERAL_requires_VARIABLE_array_to_have_at_most_MAX_item_s___but_got_COUNT:
        (LITERAL, VARIABLE, MAX, COUNT) => `${LITERAL} requires '${SC.VARIABLE}${VARIABLE}' array ` +
            `to have at most ${MAX} item(s), but got ${COUNT}`
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
    Definition_is_not_valid__because__REASON(REASON) {
        return _error(
            `Definition is not valid: ${REASON(InvalidSchemaReasons)}.`,
            Names.SCHEMA_ERROR
        );
    },
    SCHEMA_is_not_valid__Error_is_ERROR(SCHEMA, ERROR) {
        return _error(`Schema '${SCHEMA}' is not valid. Error is: ${ERROR}`, Names.SCHEMA_ERROR);
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
    TRANSFORMATION_is_not_valid__Error_is_ERROR(TRANSFORMATION, ERROR) {
        return _error(`Transformation '${TRANSFORMATION}' is not valid. Error is: ${ERROR}`);
    }
};

const SC = require('./special-characters');