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

    #schemaObject;
    #concepts;

    constructor(
        schemaObject = required('schemaObject'),
        concepts = required('concepts')
    ) {
        this.#schemaObject = schemaObject;
        this.#concepts = concepts;
    }

    #shadow;
    get shadow() {
        if (this.#shadow == null) {
            this.#shadow = {};

            castShadow(this.#shadow, this.#schemaObject, this.#concepts.shadow);
        }

        return this.#shadow;
    }
}

function castShadow(shadow, schema, conceptsShadow) {
    const variables = arrayify.get(conceptsShadow, 'variable');
    if (variables.length > 0) {
        for (let i = 0; i < variables.length; i++) {
            const variable = conceptsShadow.variable;

            shadow[variable[SYM.SELF]] = schema;
        }
        return;
    }

    const literalMap = {};
    const literals = arrayify.get(conceptsShadow, 'literal');
    for (let i = 0; i < literals.length; i++) {
        const literal = literals[i];

        literalMap[literal[SYM.SELF]] = literal;
    }

    for (const key in schema) {
        if (literalMap.hasOwnProperty(key)) {
            const literal = literalMap[key];

            castShadow(shadow, schema[key], literal);
        } else {
            const concepts = arrayify.get(conceptsShadow, 'concept');
            for (let i = 0; i < concepts.length; i++) {
                const concept = concepts[i];

                const child = { [SYM.SELF]: key };
                castShadow(child, schema[key], concept);

                arrayify.pushOrSet(shadow, concept[SYM.SELF], child);
            }
        }
    }
}

module.exports = { Schema };

const { Concepts } = require('./concepts');
const metaData = require('./meta-data');
const arrayify = require('./arrayify');
const ERR = require('./err');
const SYM = require('./symbols');
const { required } = require('./required');
