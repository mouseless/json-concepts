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

        return Concepts.#validate(this.#conceptsObject, schemaObject);
    }

    castShadow() {
        const shadow = {
            concepts: []
        };

        Concepts.#castShadow(shadow, this.#conceptsObject);

        return shadow;
    }

    static #castShadowOfConcept = function (key, concepts) {
        const shadow = {
            _: SYM.from(SYM.VARIABLE, key),
            variables: [],
            concepts: []
        };

        Concepts.#castShadow(shadow, concepts);

        return shadow;
    }

    static #castShadow = function (shadow, concepts) {
        if (typeof concepts === 'object') { // traverse
            for (const key in concepts) {
                if (SYM.is(SYM.VARIABLE, key)) {
                    shadow.concepts.push(Concepts.#castShadowOfConcept(key, concepts[key]));
                } else {
                    Concepts.#castShadow(shadow, concepts[key]);
                }
            }
        } else if (typeof concepts === 'string' && SYM.is(SYM.VARIABLE, concepts)) { // variable
            if (!shadow.hasOwnProperty('variables')) {
                shadow.variables = [];
            }
            shadow.variables.push({
                _: SYM.from(SYM.VARIABLE, concepts)
            });
        }
    }

    static #validate = function (conceptsObject, schemaObject) {
        if (typeof conceptsObject === 'string') {
            return Concepts.#validateValue(conceptsObject, schemaObject);
        }

        for (const key in conceptsObject) {
            let schemaKey = key;

            if (SYM.is(SYM.VARIABLE, key)) {
                schemaKey = Object.keys(schemaObject)[0];
            } else if (!schemaObject.hasOwnProperty(key)) {
                return false;
            }

            if (!Concepts.#validate(conceptsObject[key], schemaObject[schemaKey])) {
                return false;
            }
        }

        return Object.keys(conceptsObject).length == Object.keys(schemaObject).length;
    }

    static #validateValue = function (conceptsObject, schemaObject) {
        if (SYM.is(SYM.VARIABLE, conceptsObject)) {
            return true;
        }

        return conceptsObject === schemaObject;
    }
}

module.exports = { Concepts };

const SYM = require('./symbols');
const { Schema } = require('./schema');
const { required } = require('./required');
const ERR = require('./err');
require('./json-load');