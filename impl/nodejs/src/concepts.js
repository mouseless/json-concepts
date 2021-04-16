/* exported */ class Concepts {
    /**
     * Loads concepts from given path.
     * 
     * @async
     * @param {String} path (Required) File path or URL to load concepts from
     * 
     * @returns {Promise<Concepts>} Concepts at given path
     */
    static async load(path = required('path')) {
        const object = await loadJSON(path);

        return new Concepts(object);
    }

    /* const */ #object;
    /* const */ #shadow;

    /**
     * Concepts represents a schema for a schema. It contains a set of concept
     * definitions that is used to validate schemas against.
     * 
     * This constructor builds concepts from given object.
     * 
     * @param {Object} object (Required) Concepts object
     */
    constructor(object = required('object')) {
        this.#object = object;

        this.#shadow = new ConceptsShadow();
        this.#shadow.build(object);
    }

    /**
     * Data of this concepts as an object.
     * 
     * @returns {Object}
     */
    get object() { return this.#object; }
    /**
     * Shadow data of this concepts as an object.
     * 
     * @returns {Object}
     */
    get shadow() { return this.#shadow.data; }

    get _shadow() { return this.#shadow; }

    /**
     * Loads schema at path and create a schema using this concepts.
     * 
     * @async
     * @param {String} schemaPath (Required) File path or URL to load schema
     * from.
     * 
     * @returns {Promise<Schema>} Schema at path
     */
    async load(schemaPath = required('schemaPath')) {
        const object = await loadJSON(schemaPath);

        return this.create(object);
    }

    /**
     * Creates schema using with this as its concepts and given schema object.
     * 
     * @param {Object} schema (Required) Schema object
     * 
     * @returns {Schema} Created schema
     */
    create(schema = required('schema')) {
        return new Schema(schema, this);
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

        return _validate(this.#object, schema);
    }
}

function _validate(concepts, schema) {
    if (typeof concepts === 'string') {
        return _validateValue(concepts, schema);
    }

    for (const key in concepts) {
        let schemaKey = key;

        if (SC.VARIABLE.matches(key)) {
            schemaKey = Object.keys(schema)[0];
        } else if (!schema.hasOwnProperty(key)) {
            return false;
        }

        if (!_validate(concepts[key], schema[schemaKey])) {
            return false;
        }
    }

    return Object.keys(concepts).length == Object.keys(schema).length;
}

function _validateValue(conceptsObject, schemaObject) {
    if (SC.VARIABLE.matches(conceptsObject)) {
        return true;
    }

    return conceptsObject === schemaObject;
}

module.exports = { Concepts };

const { Schema } = require('./schema');
const { ConceptsShadow } = require('./concepts-shadow');
const { SpecialCharacters: SC, required, loadJSON } = require('./util');
