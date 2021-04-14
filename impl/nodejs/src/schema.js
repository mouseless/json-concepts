class Schema {
    /**
     * @param {String|Object} schemaPathOrObject 
     * @param {String|Object} conceptsPathOrObject
     * 
     * @returns {Schema}
     */
    static async load(
        schemaPathOrObject = required('schemaPathOrObject'),
        conceptsPathOrObject = null
    ) {
        const schemaObject = await loadJSON(schemaPathOrObject);

        conceptsPathOrObject = conceptsPathOrObject || metaData.read(schemaObject, 'concepts', true);

        if (conceptsPathOrObject === null) {
            throw error.Concepts_required_to_load_SCHEMA(schemaPathOrObject);
        }

        const concepts = await Concepts.load(conceptsPathOrObject);

        try {
            return await concepts.load(schemaObject);
        } catch (e) {
            if (e.name === error.NAMES.SCHEMA_ERROR) {
                throw error.SCHEMA_is_not_valid(schemaPathOrObject);
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
    const variables = arrayify.get(conceptsShadow, SHADOW_KEYS.VARIABLE);
    if (variables.length > 0) {
        for (let i = 0; i < variables.length; i++) {
            const variable = conceptsShadow.variable;

            shadow[variable[sc.SELF]] = schema;
        }
        return;
    }

    const literalMap = {};
    const literals = arrayify.get(conceptsShadow, SHADOW_KEYS.LITERAL);
    for (let i = 0; i < literals.length; i++) {
        const literal = literals[i];

        literalMap[literal[sc.SELF]] = literal;
    }

    for (const key in schema) {
        if (literalMap.hasOwnProperty(key)) {
            const literal = literalMap[key];

            castShadow(shadow, schema[key], literal);
        } else {
            const concepts = arrayify.get(conceptsShadow, SHADOW_KEYS.CONCEPT);
            for (let i = 0; i < concepts.length; i++) {
                const concept = concepts[i];

                const child = { [sc.SELF]: key };
                castShadow(child, schema[key], concept);

                arrayify.pushOrSet(shadow, concept[sc.SELF], child);
            }
        }
    }
}

const SHADOW_KEYS = {
    VARIABLE: 'variable',
    CONCEPT: 'concept',
    LITERAL: 'literal'
}

module.exports = { Schema };

const { Concepts } = require('./concepts');
const { sc, error, metaData, arrayify, required, loadJSON } = require('./util');
