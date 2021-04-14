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
        return new Concepts(await JSON.load(conceptsPathOrObject));
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
        const schemaObject = await JSON.load(schemaPathOrObject);

        if (this.validate(schemaObject)) {
            return new Schema(schemaObject, this);
        } else {
            throw ERR.SCHEMA_is_not_valid(schemaPathOrObject);
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
    if (typeof concepts === 'string' && SYM.is(SYM.VARIABLE, concepts)) {
        arrayify.pushOrSet(shadow, 'variable', { [SYM.SELF]: SYM.from(SYM.VARIABLE, concepts) });
    } else if (typeof concepts === 'object') {
        for (const key in concepts) {
            if (SYM.is(SYM.VARIABLE, key)) {
                const concept = { [SYM.SELF]: SYM.from(SYM.VARIABLE, key) };
                castShadow(concept, concepts[key]);
                arrayify.pushOrSet(shadow, 'concept', concept);

            } else {
                const literal = { [SYM.SELF]: key };
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

        if (SYM.is(SYM.VARIABLE, key)) {
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
    if (SYM.is(SYM.VARIABLE, conceptsObject)) {
        return true;
    }

    return conceptsObject === schemaObject;
}


module.exports = { Concepts };

const { Schema } = require('./schema');
const arrayify = require('./arrayify');
const SYM = require('./symbols');
const ERR = require('./err');
const { required } = require('./required');
require('./json-load');