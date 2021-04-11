class Schema {
    /**
     * @param {String|Object} schemaPathOrObject 
     * @param {String|Object} conceptsPathOrObject 
     * @returns {Schema}
     */
    static load(schemaPathOrObject, conceptsPathOrObject) {
        const schemaObject = JSON.load(schemaPathOrObject);

        if (schemaObject.hasOwnProperty('@concepts')) {
            conceptsPathOrObject = schemaObject['@concepts'];
            delete schemaObject['@concepts'];
        } else if (conceptsPathOrObject === null) {
            throw "error";
        }

        return Concepts
            .load(conceptsPathOrObject)
            .load(schemaObject);
    }

    #schemaObject;

    constructor(schemaObject) {
        this.#schemaObject = schemaObject;
    }
}

module.exports = { Schema };

const Concepts = require('./concepts').Concepts;