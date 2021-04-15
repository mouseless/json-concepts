/* export */ class Concepts {
    /**
     * @async
     * @param {String|Object} pathOrObject
     * 
     * @returns {Promise<Concepts>} 
     */
    static async load(pathOrObject = required('pathOrObject')) {
        return new Concepts(await loadJSON(pathOrObject));
    }

    /* const */ #object;
    /* const */ #root;

    constructor(object = required('object')) {
        this.#object = object;
        this.#root = new Concept();

        this.#root.build(object);
    }

    get object() {
        return this.#object;
    }

    get shadow() {
        return this.#root.shadow;
    }

    get _root() {
        return this.#root;
    }

    /**
     * @async
     * @param {String|Object} schemaPathOrObject 
     * 
     * @returns {Promise<Schema>}
     */
    async load(schemaPathOrObject = required('schemaPathOrObject')) {
        const schemaObject = await loadJSON(schemaPathOrObject);

        if (this.validate(schemaObject)) {
            return new Schema(schemaObject, this);
        } else {
            throw error.SCHEMA_is_not_valid(schemaPathOrObject);
        }
    }

    /**
     * @param {Object} schemaObject
     * 
     * @returns {boolean}
     */
    validate(schemaObject = null) {
        if (schemaObject === null) {
            return false;
        }

        return validate(this.#object, schemaObject);
    }
}

function validate(conceptsObject, schemaObject) {
    if (typeof conceptsObject === 'string') {
        return validateValue(conceptsObject, schemaObject);
    }

    for (const key in conceptsObject) {
        let schemaKey = key;

        if (sc.is(sc.VARIABLE, key)) {
            schemaKey = Object.keys(schemaObject)[0];
        } else if (!schemaObject.hasOwnProperty(key)) {
            return false;
        }

        if (!validate(conceptsObject[key], schemaObject[schemaKey])) {
            return false;
        }
    }

    return Object.keys(conceptsObject).length == Object.keys(schemaObject).length;
}

function validateValue(conceptsObject, schemaObject) {
    if (sc.is(sc.VARIABLE, conceptsObject)) {
        return true;
    }

    return conceptsObject === schemaObject;
}

module.exports = { Concepts };

const { Schema } = require('./schema');
const { Concept } = require('./concept');
const { error, sc, required, loadJSON } = require('./util');
