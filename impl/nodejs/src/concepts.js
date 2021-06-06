/* exported */ class Concepts {
    /**
     * Data that represents a concept
     * 
     * @typedef {Object} ConceptData
     * @property {String} name Name of concept
     * @property {VariablesData} variables Variables of concept
     */
    /**
     * Variables are stored in an object instead of an array to provide quick
     * access via variable name.
     * 
     * @typedef {Object.<string, VariableData>} VariablesData
     */
    /**
     * Data that represent a variable
     * 
     * @typedef {Object} VariableData
     * @property {String} name Name of variable
     */

    /**
     * Loads concepts from given path.
     * 
     * @async
     * @param {String} path (Required) Path or URL to load concepts from
     * @param {String} relativeTo Path or URL to load concepts relatively to
     * 
     * @returns {Promise<Concepts>} Concepts at given path
     */
    static async load(
        path = required('path'),
        relativeTo
    ) {
        const definition = await Macro.load(path, relativeTo);

        try {
            return new Concepts(definition);
        } catch (e) {
            if (e.name == error.Names.SCHEMA_ERROR) {
                throw error.CONCEPTS_is_not_valid__Error_is__ERROR(path, e.message);
            }

            throw e;
        }
    }

    /* const */ #types;
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
        this.#types = createTypes(
            metaData.read(definition, 'types', /* burnAfterReading */ true)
        );

        this.#definition = Macro.process(definition);
        this.#shadow = new ConceptsShadow().build(definition, this.#types);
        this.#concepts = {};

        if (this.#shadow.literals.length > 0) {
            this.#concepts[SC.SELF] = {
                name: SC.SELF,
                variables: this.#shadow.getAllVariables()
            };
        }

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
     * @returns {Array.<ConceptData>}
     */
    get list() { return Object.values(this.#concepts); }
    /**
     * Lists all type definitions including built-in and custom types.
     * 
     * @returns {Array.<import('./types').TypeData>}
     */
    get types() { return Object.values(this.#types); }

    get _shadow() { return this.#shadow; }

    /**
     * Checks if a concept with given name exists.
     * 
     * @param {String} name (Required) Name to check
     * @returns {boolean} `true` if it exists, `false` otherwise
     */
    has(name = required('name')) { return Object.prototype.hasOwnProperty.call(this.#concepts, name); }
    /**
     * Gets concept with a given name. Returns `undefined` when a concept with
     * given name does not exist.
     * 
     * @param {String} name (Required) Name of concept to get
     * 
     * @returns {ConceptData} Concept with given name
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
        return Schema.load(path, this);
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

        this.#shadow.validate(schema);
    }

    /**
     * @param {ConceptsShadow} shadow
     */
    _build(
        shadow,
        _trace = new Set()
    ) {
        if (_trace.has(shadow)) {
            return;
        }

        _trace.add(shadow);

        for (const concept of shadow.concepts) {
            this.#concepts[concept.name] = {
                name: concept.name,
                variables: concept.getAllVariables()
            };
            this._build(concept, _trace);
        }
    }
}

module.exports = Concepts;

const Schema = require('./schema');
const ConceptsShadow = require('./concepts-shadow');
const Macro = require('./macro');
const { createTypes } = require('./types');
const { SpecialCharacters: SC, error, metaData, required } = require('./util');
