/* exported */ class Concepts {
    /**
     * Data that represents a concept
     * 
     * @typedef {Object} Concept
     * @property {String} name Name of concept
     * @property {Variables} variables Variables of concept
     */
    /**
     * Variables are stored in an object instead of an array to provide quick
     * access via variable name.
     * 
     * @typedef {Object} Variables
     * @see Variable
     */
    /**
     * Data that represent a variable
     * 
     * @typedef {Object} Variable
     * @property {String} name Name of variable
     */

    /**
     * Loads concepts from given path.
     * 
     * @async
     * @param {String} path (Required) File path or URL to load concepts from
     * 
     * @returns {Promise<Concepts>} Concepts at given path
     */
    static async load(path = required('path')) {
        const definition = await loadJSON(path);

        return new Concepts(definition);
    }

    /* const */ #definition;
    /* const */ #shadow;
    /* const */ #concepts;

    /**
     * Concepts represents a schema for a schema. It contains a set of concept
     * definitions that is used to validate schemas against.
     * 
     * This constructor builds concepts from given definition.
     * 
     * @param {Object} definition (Required) Concepts definition
     */
    constructor(definition = required('definition')) {
        this.#definition = definition;

        this.#shadow = new ConceptsShadow();
        this.#shadow.build(definition);
        this.#concepts = {};

        this._build(this.#shadow);
    }

    /**
     * Definition of this concepts as an object.
     * 
     * @returns {Object}
     */
    get definition() { return this.#definition; }
    /**
     * Shadow definition of this concepts as an object.
     * 
     * @returns {Object}
     */
    get shadow() { return this.#shadow.data; }
    /**
     * Lists concepts in an array.
     * 
     * @returns {Array.<Concept>}
     */
    get list() { return Object.values(this.#concepts); }

    get _shadow() { return this.#shadow; }

    /**
     * Checks if a concept with given name exists.
     * 
     * @param {String} name (Required) Name to check
     * @returns {boolean} `true` if it exists, `false` otherwise
     */
    has(name = required('name')) { return this.#concepts.hasOwnProperty(name); }
    /**
     * Gets concept with a given name. Returns `undefined` when a concept with
     * given name does not exist.
     * 
     * @param {String} name (Required) Name of concept to get
     * 
     * @returns {Concept} Concept with given name
     */
    get(name = required('name')) { return this.#concepts[name]; }

    /**
     * Loads schema at path and create a schema using this concepts.
     * 
     * @async
     * @param {String} path (Required) File path or URL to load schema
     * from.
     * 
     * @returns {Promise<Schema>} Schema at path
     */
    async load(path = required('path')) {
        const definition = await loadJSON(path);

        return this.create(definition);
    }

    /**
     * Creates schema using with this and given schema definition.
     * 
     * @param {Object} definition (Required) Schema definition
     * 
     * @returns {Schema} Created schema
     */
    create(definition = required('definition')) {
        return new Schema(definition, this);
    }

    /**
     * Validates schema against this concepts definition, and throws error if
     * it is not valid.
     * 
     * @param {Schema|Object} schema (Required) Schema to validate. Accepts
     * definition or Schema itself.
     */
    validate(schema = required('schema')) {
        if (schema instanceof Schema) {
            schema = schema.definition;
        }

        _validate(this.#shadow, schema);
    }

    _build(shadow) {
        for (const concept of shadow.concepts) {
            this.#concepts[concept.name] = {
                name: concept.name,
                variables: _variables(concept)
            };
            this._build(concept);
        }
    }
}

function _variables(shadow, result = {}) {
    for (const variable of shadow.variables) {
        result[variable.name] = { name: variable.name };
    }

    for (const literal of shadow.literals) {
        _variables(literal, result);
    }

    return result;
}

/**
 * 
 * @param {ConceptsShadow} conceptsShadow 
 * @param {Object} schemaDefinition 
 */
function _validate(conceptsShadow, schemaDefinition) {
    if (conceptsShadow.hasAnyVariables()) {
        //will validate variable here
        return;
    }

    if (typeof schemaDefinition == 'string') {
        if (conceptsShadow.hasLiteral(schemaDefinition) &&
            conceptsShadow.literals.length === 1 &&
            !conceptsShadow.hasAnyConcepts()) {
            return;
        }

        if (conceptsShadow.hasAnyLiterals()) {
            let expectedLiteral = conceptsShadow.literals[0].name;
            if (expectedLiteral === schemaDefinition) {
                expectedLiteral = conceptsShadow.literals[1].name;
            }

            throw error.Definition_is_not_valid__because__REASON(
                because => because.Expected_LITERAL_got_VALUE(expectedLiteral, schemaDefinition)
            );
        }

        if (conceptsShadow.hasAnyConcepts()) {
            throw error.Definition_is_not_valid__because__REASON(
                because => because.CONCEPT_is_missing(conceptsShadow.concepts[0].name)
            );
        }

        throw error.Definition_is_not_valid__because__REASON(
            because => because.TOKEN_is_not_expected(schemaDefinition)
        );
    }

    const schemaKeys = {};
    if (schemaDefinition != null) {
        Object.keys(schemaDefinition).forEach(key => schemaKeys[key] = true);
    }

    for (const literal of conceptsShadow.literals) {
        if (schemaDefinition == null || !schemaDefinition.hasOwnProperty(literal.name)) {
            throw error.Definition_is_not_valid__because__REASON(
                because => because.LITERAL_is_missing(literal.name)
            );
        }

        _validate(literal, schemaDefinition[literal.name]);

        delete schemaKeys[literal.name];
    }

    const quantities = {};
    const errors = {};

    for (const concept of conceptsShadow.concepts) {
        quantities[concept.name] = 0;

        const remainingKeys = Object.keys(schemaKeys);
        for (const remainingKey of remainingKeys) {
            try {
                _validate(concept, schemaDefinition[remainingKey]);

                quantities[concept.name]++;
                delete schemaKeys[remainingKey];
                if (errors.hasOwnProperty(remainingKey)) {
                    delete errors[remainingKey];
                }
            } catch (e) {
                if (e.name != error.Names.SCHEMA_ERROR) {
                    throw e;
                }

                arrayify.push(errors, remainingKey, { concept: concept, validationError: e });
            }
        }
    }

    const remainingKeys = Object.keys(schemaKeys);
    if (remainingKeys.length > 0) {
        const remainingKey = remainingKeys[0];

        if (errors.hasOwnProperty(remainingKey)) {
            throw arrayify.get(errors, remainingKey)[0].validationError;
        } else {
            throw error.Definition_is_not_valid__because__REASON(
                because => because.TOKEN_is_not_expected(remainingKey)
            );
        }
    }
    
    for (const concept of conceptsShadow.concepts) {
        if (quantities[concept.name] < concept.quantifier.min) {
            throw error.Definition_is_not_valid__because__REASON(
                because => because.CONCEPT_is_missing(concept.name)
            );
        }
    }
}

module.exports = Concepts;

const Schema = require('./schema');
const ConceptsShadow = require('./concepts-shadow');
const { arrayify, error, required, loadJSON } = require('./util');
