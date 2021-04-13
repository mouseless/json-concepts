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
        } catch (e) {
            if (e.name === ERR.NAMES.SCHEMA_ERROR) {
                throw ERR.SCHEMA_is_not_valid(schemaPathOrObject);
            }

            throw e;
        }
    }

    #concepts;
    #schemaObject;

    constructor(
        schemaObject = required('schemaObject'),
        concepts = required('concepts')
    ) {
        this.#schemaObject = schemaObject;
        this.#concepts = concepts;
    }

    castShadow() {
        const shadow = {};

        Schema.#castShadow(shadow, this.#schemaObject, this.#concepts.castShadow().concepts);

        console.log();
        console.log(shadow);

        return shadow;
    }

    static #castShadow = function (shadow, schema, concepts) {
        for (let i = 0; i < concepts.length; i++) {
            const concept = concepts[i];

            for (const key in schema) {
                const child = {
                    _: key
                };

                //Schema.#castShadow(shadow, schema[key], concept.concepts);

                if (!shadow.hasOwnProperty(concept._)) {
                    shadow[concept._] = child;
                } else {
                    if (!Array.isArray(shadow[concept._])) {
                        shadow[concept._] = [shadow[concept._]];
                    }

                    shadow[concept._].push(child);
                }
            }
        }
    }
}

module.exports = { Schema };

const { Concepts } = require('./concepts');
const metaData = require('./meta-data');
const ERR = require('./err');
const { required } = require('./required');
