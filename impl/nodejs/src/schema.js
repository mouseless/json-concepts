class Schema {
    /**
     * @param {String|Object} schemaPathOrObject 
     * @param {String|Object} conceptsPathOrObject 
     * @returns {Schema}
     */
    static async load(schemaPathOrObject, conceptsPathOrObject) {
        const schemaObject = await JSON.load(schemaPathOrObject);

        if (schemaObject.hasOwnProperty('@concepts')) {
            conceptsPathOrObject = schemaObject['@concepts'];
            delete schemaObject['@concepts'];
        } else if (conceptsPathOrObject === null) {
            throw "error";
        }

        const concepts = await Concepts.load(conceptsPathOrObject);
        
        return await concepts.load(schemaObject);
    }

    #schemaObject;

    constructor(schemaObject) {
        this.#schemaObject = schemaObject;
    }
}

module.exports = { Schema };

const Concepts = require('./concepts').Concepts;