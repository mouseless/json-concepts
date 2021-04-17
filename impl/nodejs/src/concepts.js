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
     * Validates schema against this concepts definition.
     * 
     * @param {Schema|Object} schema Schema to validate. Accepts both an object
     * and an instance of Schema.
     * 
     * @returns {boolean} `true` if schema is valid, `false` otherwise
     */
    validate(schema = null) {
        if (schema === null) {
            return false;
        }

        return _validate(this.#definition, schema);
    }

    _build(shadow) {
        for (const concept of shadow.concepts) {
            this.#concepts[concept.name] = {
                name: concept.name,
                variables: this._variables(concept)
            };
            this._build(concept);
        }
    }

    _variables(shadow, result = {}) {
        for (const variable of shadow.variables) {
            result[variable.name] = { name: variable.name };
        }

        for(const literal of shadow.literals) {
            this._variables(literal, result);
        }

        return result;
    }
}

function _validate(definition, schema) {
    if (typeof definition === 'string') {
        return _validateValue(definition, schema);
    }

    for (const key in definition) {
        let schemaKey = key;

        if (SC.VARIABLE.matches(key)) {
            schemaKey = Object.keys(schema)[0];
        } else if (!schema.hasOwnProperty(key)) {
            return false;
        }

        if (!_validate(definition[key], schema[schemaKey])) {
            return false;
        }
    }

    return Object.keys(definition).length == Object.keys(schema).length;
}

function _validateValue(definition, schema) {
    if (SC.VARIABLE.matches(definition)) {
        return true;
    }

    return definition === schema;
}

module.exports = { Concepts };

const { Schema } = require('./schema');
const { ConceptsShadow } = require('./concepts-shadow');
const { SpecialCharacters: SC, required, loadJSON } = require('./util');
