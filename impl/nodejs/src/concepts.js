class Concepts {
    /**
     * @async
     * @param {String|Object} conceptsPathOrObject
     * 
     * @returns {Promise<Concepts>} 
     */
    static async load(
        conceptsPathOrObject = required('conceptsPathOrObject')
    ) {
        return new Concepts(await loadJSON(conceptsPathOrObject));
    }

    #conceptsObject;

    constructor(
        conceptsObject = required('conceptsObject')
    ) {
        this.#conceptsObject = conceptsObject;
    }

    get object() {
        return this.#conceptsObject;
    }

    #shadow;
    get shadow() {
        if (this.#shadow == null) {
            this.#shadow = {};

            castShadow(this.#shadow, this.#conceptsObject);
        }

        return this.#shadow;
    }

    /**
     * @async
     * @param {String|Object} schemaPathOrObject 
     * 
     * @returns {Promise<Schema>}
     */
    async load(
        schemaPathOrObject = required('schemaPathOrObject')
    ) {
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

        return validate(this.#conceptsObject, schemaObject);
    }
}

function castShadow(shadow, concepts) {
    if (typeof concepts === 'string' && sc.is(sc.VARIABLE, concepts)) {
        arrayify.pushOrSet(shadow, 'variable', { [sc.SELF]: sc.from(sc.VARIABLE, concepts) });
    } else if (typeof concepts === 'object') {
        for (const key in concepts) {
            if (sc.is(sc.VARIABLE, key)) {
                const concept = { [sc.SELF]: sc.from(sc.VARIABLE, key) };
                castShadow(concept, concepts[key]);
                arrayify.pushOrSet(shadow, 'concept', concept);

            } else {
                const literal = { [sc.SELF]: key };
                castShadow(literal, concepts[key]);
                arrayify.pushOrSet(shadow, 'literal', literal);
            }
        }
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
const { arrayify, error, sc, required, loadJSON } = require('./util');
