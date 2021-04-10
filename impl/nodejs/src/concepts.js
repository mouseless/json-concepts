const symbols = require('./symbols');

class Concepts {
    /**
     * @param {Object} options
     * @param {Object} options.object
     * @param {String} options.path
     * 
     * @returns {Concepts} 
     */
    static load(conceptsObject) {
        return new Concepts(conceptsObject);
    }

    #conceptsObject;

    constructor(conceptsObject) {
        this.#conceptsObject = conceptsObject;
    }

    get object() {
        return this.#conceptsObject;
    }

    /**
     * @param {Object} schemaObject
     */
    validate(schemaObject) {
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

    static #isVariable = function (conceptsObject) {
        return conceptsObject.startsWith(symbols.VARIABLE);
    }
}

module.exports = { Concepts };