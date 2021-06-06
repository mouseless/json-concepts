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
};

/**
 * Reason messages for invalid concepts.
 */
const InvalidConceptsReasons = {
    LITERAL_cannot_have_QUANTIFIER:
        (LITERAL, QUANTIFIER) => `'${LITERAL}' cannot have '${QUANTIFIER}' quantifier`,
    Cannot_declare_VARIABLE_more_than_once:
        (VARIABLE) => `Cannot declare '${SC.VARIABLE}${VARIABLE}' more than once`,
    CONCEPT_cannot_declare_VARIABLE_more_than_once:
        (CONCEPT, VARIABLE) => CONCEPT == null
            ? InvalidConceptsReasons.Cannot_declare_VARIABLE_more_than_once(VARIABLE)
            : `'${CONCEPT}' cannot declare '${SC.VARIABLE}${VARIABLE}' more than once`,
    VALIDATOR_does_not_support_TYPE:
        (VALIDATOR, TYPE) => `${VALIDATOR} does not support ${TYPE}'`,
    Unknown_type_TYPE_in_EXPRESSION:
        (TYPE, EXPRESSION) => `Unknown type '${TYPE}' in '${EXPRESSION}'`,
    Unknown_type_TYPE:
        (TYPE) => `Unknown type '${TYPE}'`,
    Cannot_parse_EXPRESSION__a_type_was_expected_after_symbol:
        (EXPRESSION) => `Cannot parse '${EXPRESSION}', a type was expected after '${SC.TYPE}'`,
    Cannot_parse_quantifier__EXPRESSION:
        (EXPRESSION) => `Cannot parse quantifier: '${EXPRESSION}'`,
    VALIDATOR_does_not_exist:
        (VALIDATOR) => `Validator '${VALIDATOR}' does not exist`,
    Cannot_create_a_validator_from_EXPRESSION:
        (EXPRESSION) => `Cannot create a validator from '${EXPRESSION}'`,
    TYPE_cannot_inherit_from_BASE__it_would_cause_a_circular_dependency:
        (TYPE, BASE) => `'${TYPE}' cannot inherit from '${BASE}', it would ` +
            'cause a circular dependency',
    CONCEPT_cannot_be_TYPE__only_string_allowed:
        (CONCEPT, TYPE) => `'${CONCEPT}' cannot be '${TYPE}', only string is allowed`,
    CONCEPT_cannot_be_TYPE__only_string_allowed_but_TYPE_is_ROOT:
        (CONCEPT, TYPE, ROOT) => TYPE === ROOT
            ? InvalidConceptsReasons.CONCEPT_cannot_be_TYPE__only_string_allowed(CONCEPT, TYPE)
            : `'${CONCEPT}' cannot be '${TYPE}', only string is allowed but '${TYPE}' is '${ROOT}'`,
    KEY_array_should_have_1_item__but_got_COUNT:
        (KEY, COUNT) => `'${KEY}' array should have 1 item, but got ${COUNT}`,
    Expected_a_variable__but_got_a_literal__EXPRESSION:
        (EXPRESSION) => `Expected a variable, but got a literal: '${EXPRESSION}'`,
    Cannot_declare_CONCEPT_more_than_once:
        (CONCEPT) => `Cannot declare ${CONCEPT} more than once`,
    REFERENCE_cannot_be_found: (REFERENCE) => `${REFERENCE} cannot be found`,
    Reference_EXPRESSION_must_have_a_name:
        (EXPRESSION) => `Reference '"#": ${JSON.stringify(EXPRESSION)}' must have a name`,
    REFERENCE_should_be_defined_at_the_root:
        (REFERENCE) => `${REFERENCE} should be defined at the root`,
    All_items_in_EXPRESSION_should_be_a_reference:
        (EXPRESSION) => `All items in '${EXPRESSION}' should be a reference`,
    Cannot_merge_a_non_object_reference__REFERENCE:
        (REFERENCE) => `Cannot merge a non-object reference: '${REFERENCE}'`,
    Cannot_merge_REFERENCES__conflict_occurs_on_KEY:
        (REFERENCES, KEY) => `Cannot merge '${JSON.stringify(REFERENCES)}', ` +
            `conflict occurs on '${KEY}'`,
    Cannot_assign_SOURCE_to_KEY__there_is_already_a_value__TARGET:
        (SOURCE, KEY, TARGET) => `Cannot assign '${JSON.stringify(SOURCE)}' to '${KEY}', ` +
            `there is already a value: '${JSON.stringify(TARGET)}'`,
    Inject_expects_an_object_or_an_array_of_objects__but_got_VALUE:
        (VALUE) => `Inject expects an object or an array of objects, but got '${JSON.stringify(VALUE)}'`
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
    Object_not_expected: (VALUE) => `Object not expected: ${JSON.stringify(VALUE)}`,
    VALUE_is_not_a_valid_TYPE: (VALUE, TYPE) => `'${VALUE}' is not a valid ${TYPE}`,
    VARIABLE_is_not_an_array: (VARIABLE) => `'${VARIABLE}' is not an array`,
    VARIABLE_expects_at_most_EXPECTED_dimensional_array__but_got_ACTUAL:
        (VARIABLE, EXPECTED, ACTUAL) => EXPECTED == 0
            ? InvalidSchemaReasons.VARIABLE_is_not_an_array(VARIABLE)
            : `'${VARIABLE}' expects at most ${EXPECTED} dimensional array, but got ${ACTUAL}`,
    Concept_expected_in_EXPRESSION: (EXPRESSION) => `Concept expected in '${EXPRESSION}'`,
    EXPRESSION_could_not_be_parsed: (EXPRESSION) => `'${EXPRESSION}' could not be parsed`,
    EXPRESSION_could_not_be_parsed__CONCEPT_does_not_exist:
        (EXPRESSION, CONCEPT) => CONCEPT
            ? InvalidSchemaReasons.EXPRESSION_could_not_be_parsed(EXPRESSION)
            : `'${EXPRESSION}' could not be parsed, '${CONCEPT}' does not exist`
};

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
};

function _error(message, name = Names.ERROR) {
    const result = new Error(message);

    result.name = name;

    return result;
}

module.exports = {
    Names,
    PARAMETER_is_required(PARAMETER) {
        return _error(`${PARAMETER} is required.`);
    },
    Expected_type_was_EXPECTED_got_ACTUAL(EXPECTED, ACTUAL) {
        return _error(`Expected type was '${EXPECTED}', got '${ACTUAL}'.`);
    },
    FILE_is_not_a_valid_json(FILE) {
        return _error(`'${FILE}' is not a valid json.`);
    },
    Cannot_load_URL(URL) {
        return _error(`Cannot load '${URL}'.`);
    },
    Cannot_load_FILE(FILE) {
        return _error(`Cannot load '${FILE}'.`);
    },
    Concepts_required_to_load_SCHEMA(SCHEMA) {
        return _error(`Concepts required to load ${SCHEMA}.` +
            ` Either specify @concepts meta-data within ${SCHEMA}, or pass concepts as a parameter.`
        );
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
    Concepts_definition_is_not_valid__REASON(REASON) {
        return _error(
            `Concepts definition is not valid: ${REASON(InvalidConceptsReasons)}.`,
            Names.SCHEMA_ERROR
        );
    },
    CONCEPTS_is_not_valid__Error_is__ERROR(CONCEPTS, ERROR) {
        return _error(
            `'${CONCEPTS}' is not valid. Error is: ${ERROR}`,
            Names.SCHEMA_ERROR
        );
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
    Schema_definition_is_not_valid__REASON(REASON) {
        return _error(
            `Schema definition is not valid: ${REASON(InvalidSchemaReasons)}.`,
            Names.SCHEMA_ERROR
        );
    },
    SCHEMA_is_not_valid__Error_is__ERROR(SCHEMA, ERROR) {
        return _error(
            `'${SCHEMA}' is not valid. Error is: ${ERROR}`,
            Names.SCHEMA_ERROR
        );
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
    Definition_is_not_compatible_with_its_CONCEPTS__REASON(CONCEPTS, REASON) {
        return _error(
            `Definition is not compatible with its ${CONCEPTS}: ` +
            `${REASON(InvalidTransformationReasons)(CONCEPTS)}.`,
            Names.SCHEMA_ERROR
        );
    },
    TRANSFORMATION_is_not_valid__Error_is__ERROR(TRANSFORMATION, ERROR) {
        return _error(
            `'${TRANSFORMATION}' is not valid. Error is: ${ERROR}`,
            Names.SCHEMA_ERROR
        );
    }
};

const SC = require('./special-characters');