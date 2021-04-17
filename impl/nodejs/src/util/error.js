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
 * @callback reasonMessageBuilder
 * @param {String} concepts Name of concepts
 * 
 * @returns {String} Reason message
 */
/**
 * Reason message builders
 */
const Reasons = {
    /**
     * Use this when a concept with given name was expected.
     * 
     * @param {String} CONCEPT Name of the expected concept
     * 
     * @returns {reasonMessageBuilder} Reason message builder to be used with a
     * concepts name.
     */
    CONCEPT_not_found: CONCEPT => CONCEPTS => `Concept named '${CONCEPT}' is not found in ${CONCEPTS} concepts`,
    /**
     * Use this when a variable with given name was expected.
     * 
     * @param {String} VARIABLE Name of the expected variable
     * 
     * @returns {reasonMessageBuilder} Reason message builder to be used with a
     * concepts name.
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
    Reasons,
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
    PARAMETER_is_required(PARAMETER) {
        return _error(`${PARAMETER} is required`);
    },
    SCHEMA_is_not_valid(SCHEMA) {
        if (typeof SCHEMA === 'object') {
            SCHEMA = 'Schema';
        }

        return _error(`${SCHEMA} is not valid`, Names.SCHEMA_ERROR);
    },
    Expected_type_was_EXPECTED_got_ACTUAL(EXPECTED, ACTUAL) {
        return _error(`Expected type was '${EXPECTED}', got '${ACTUAL}'`);
    },

    /**
     * Selects reason from given reasons.
     * 
     * @callback reasonCallback
     * @param {Reasons} reasons Reason builder
     * 
     * @returns {reasonMessageBuilder}
     */
    /**
     * 
     * @param {String} CONCEPTS 
     * @param {reasonCallback} REASON 
     * 
     * @returns {Error} An error with name set to `Names.SchemaError`
     */
    Definition_is_not_compatible_with_its_CONCEPTS__because__REASON(CONCEPTS, REASON) {
        return _error(
            `Definition is not compatible with its ${CONCEPTS}, ` +
            `because: ${REASON(Reasons)(CONCEPTS)}`,
            Names.SCHEMA_ERROR
        );
    },
    TRANSFORMATION_is_not_valid__Error_is_ERROR(TRANSFORMATION, ERROR) {
        return _error(`Transformation '${TRANSFORMATION}' is not valid. Error is: ${ERROR}`);
    }
};