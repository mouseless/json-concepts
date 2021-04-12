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
            return new Schema(schemaObject);
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

        return Concepts.#validateRecursively(this.#conceptsObject, schemaObject);
    }

    static #validateRecursively = function (conceptsObject, schemaObject) {
        if (typeof conceptsObject === 'string') {
            return Concepts.#validateValue(conceptsObject, schemaObject);
        }

        for (const key in conceptsObject) {
            let schemaKey = key;

            if (Concepts.#isVariable(key)) {
                schemaKey = Object.keys(schemaObject)[0];
            } else if (!schemaObject.hasOwnProperty(key)) {
                return false;
            }

            if (!Concepts.#validateRecursively(conceptsObject[key], schemaObject[schemaKey])) {
                return false;
            }
        }

        return Object.keys(conceptsObject).length == Object.keys(schemaObject).length;
    }

    static #validateValue = function (conceptsObject, schemaObject) {
        if (Concepts.#isVariable(conceptsObject)) {
            return true;
        }

        return conceptsObject === schemaObject;
    }

    static #isVariable = function (expression) {
        return expression.startsWith(symbols.VARIABLE);
    }

    static #isMetaData = function (expression) {
        return expression.startsWith(symbols.META_DATA);
    }
}

module.exports = { Concepts };

const symbols = require('./symbols');
const { Schema } = require('./schema');
const { required } = require('./required');
const ERR = require('./err');
require('./json-load');