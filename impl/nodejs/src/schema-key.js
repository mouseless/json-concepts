/**
 * An object that represents a schema key.
 * 
 * @typedef {Object} SchemaKeyObject
 * @property {String} name Name part of the key
 * @property {mightBelongTo} mightBelongTo Method to check for an explicit
 * concept declaration.
 * 
 * @private
 */
/**
 * Checks if a schema key object might belong to a concept or not.
 * 
 * @callback mightBelongTo
 * @param {ConceptsShadow_} concept Concept to check against
 * 
 * @returns {Boolean} `true` if it might, `false` otherwise
 * 
 * @private
 */

/**
 * Parses every key in given schema definition object, and put them into one
 * object. If a concept is specified explicitly and could not be validated
 * it throws an error.
 * 
 * @param {Object} definition (Required) Schema definition to iterate
 * @param {ConceptsShadow_} concepts (Required) Parent concepts shadow node of
 * given schema definition.
 * 
 * @returns {Object.<String,SchemaKeyObject>} Schema keys objects by key
 * 
 * @private
 */
function parseKeys(
    definition = require('definition'),
    concepts = required('concepts')
) {
    /** @type {Object.<String,SchemaKeyObject>} */
    const result = {};

    if (definition == null) {
        return result;
    }

    Object.keys(definition).forEach(key => {
        const parts = key.split(SC.TYPE);
        if (parts.length == 1) {
            result[key] = { name: key, mightBelongTo: _mightBelongTo };
        } else if (parts.length == 2) {
            if (parts[1] == '') {
                throw error.Schema_definition_is_not_valid__REASON(
                    because => because.Concept_expected_in_EXPRESSION(key)
                );
            } else if (!concepts.getConcept(parts[1])) {
                throw error.Schema_definition_is_not_valid__REASON(
                    because => because.EXPRESSION_could_not_be_parsed__CONCEPT_does_not_exist(
                        key, parts[1]
                    )
                );
            }

            result[key] = { name: parts[0], _concept: parts[1], mightBelongTo: _mightBelongTo };
        } else {
            throw error.Schema_definition_is_not_valid__REASON(
                because => because.EXPRESSION_could_not_be_parsed(key)
            );
        }
    });

    return result;
}

/**
 * @param {ConceptsShadow_} concept 
 * 
 * @returns {Boolean}
 * 
 * @private
 */
function _mightBelongTo(concept) {
    return !this._concept || this._concept == concept.name;
}

module.exports = {
    parseKeys
};

const ConceptsShadow_ = require('./concepts-shadow');
const { SpecialCharacters: SC, error, required } = require('./util');