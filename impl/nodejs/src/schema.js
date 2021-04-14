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
        if(this.#shadow == null) {
            this.#shadow = {};
    
            castShadow(this.#shadow, this.#schemaObject, this.#concepts.shadow);
        }

        return this.#shadow;
    }
}

function castShadow(shadow, schema, conceptsShadow) {
    if (conceptsShadow.hasOwnProperty('variable')) {
        const variable = conceptsShadow.variable;

        shadow[variable[SYM.SELF]] = schema;
        return;
    }

    const literalMap = {};
    if (conceptsShadow.hasOwnProperty('literals')) {
        for (let i = 0; i < conceptsShadow.literals.length; i++) {
            const literal = conceptsShadow.literals[i];

            literalMap[literal[SYM.SELF]] = literal;
        }
    }

    for (const key in schema) {
        if (literalMap.hasOwnProperty(key)) {
            const literal = literalMap[key];

            castShadow(shadow, schema[key], literal);
        } else {
            if (conceptsShadow.hasOwnProperty('concepts')) {
                for (let i = 0; i < conceptsShadow.concepts.length; i++) {
                    const concept = conceptsShadow.concepts[i];

                    const child = { [SYM.SELF]: key };
                    castShadow(child, schema[key], concept);

                    setOrPush(shadow, concept[SYM.SELF], child);
                }
            }
        }
    }
}

function setOrPush(source, key, value) {
    if (!source.hasOwnProperty(key)) {
        source[key] = value;
    } else {
        if (!Array.isArray(source[key])) {
            source[key] = [source[key]];
        }

        source[key].push(value);
    }
}

module.exports = { Schema };

const { Concepts } = require('./concepts');
const metaData = require('./meta-data');
const ERR = require('./err');
const SYM = require('./symbols');
const { required } = require('./required');
const jf = require('json-format');
