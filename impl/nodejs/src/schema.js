class Schema {
    /**
     * @param {String|Object} schemaPathOrObject 
     * @param {String|Object} conceptsPathOrObject 
     * @returns {Schema}
     */
    static async load(
        schemaPathOrObject = required('schemaPathOrObject'),
        conceptsPathOrObject = null
    ) {
        const schemaObject = await JSON.load(schemaPathOrObject);

        conceptsPathOrObject = conceptsPathOrObject || metaData.read(schemaObject, 'concepts', true);

        if (conceptsPathOrObject === null) {
            throw ERR.Concepts_required_to_load_SCHEMA(schemaPathOrObject);
        }

        const concepts = await Concepts.load(conceptsPathOrObject);

        try {
            return await concepts.load(schemaObject);
        } catch(e) {
            if(e.name === ERR.NAMES.SCHEMA_ERROR) {
                throw ERR.SCHEMA_is_not_valid(schemaPathOrObject);
            }

            throw e;
        }
    }

    #schemaObject;

    constructor(schemaObject) {
        this.#schemaObject = schemaObject;
    }
}

module.exports = { Schema };

const { Concepts } = require('./concepts');
const metaData = require('./meta-data');
const ERR = require('./err');