class Schema {
    /**
     * @param {String|Object} pathOrObject 
     * @param {String|Object|Concepts} concepts
     * 
     * @returns {Schema}
     */
    static async load(
        pathOrObject = required('pathOrObject'),
        concepts = null
    ) {
        const object = await loadJSON(pathOrObject);

        concepts = concepts || metaData.read(object, 'concepts', true);

        if (concepts === null) {
            throw error.Concepts_required_to_load_SCHEMA(pathOrObject);
        }

        if (!(concepts instanceof Concepts)) {
            concepts = await Concepts.load(concepts);
        }

        try {
            return await concepts.load(object);
        } catch (e) {
            if (e.name === error.Names.SCHEMA_ERROR) {
                throw error.SCHEMA_is_not_valid(pathOrObject);
            }

            throw e;
        }
    }

    #object;
    #concepts;
    #shadow;

    constructor(
        object = required('object'),
        concepts = required('concepts')
    ) {
        this.#object = object;
        this.#concepts = concepts;
    }

    get object() {
        return this.#object;
    }

    get shadow() {
        if (this.#shadow == null) {
            this.#shadow = {};

            castShadow(this.#shadow, this.#object, this.#concepts.shadow);
        }

        return this.#shadow;
    }
}

function castShadow(shadow, schema, concept) {
    concept = Concept.from(concept);
    if (concept.hasVariable()) {
        for (const variable of concept.variables) {
            shadow[variable[sc.SELF]] = schema;
        }
        return;
    }

    for (const key in schema) {
        if (concept.hasLiteral(key)) {
            castShadow(shadow, schema[key], concept.getLiteral(key));
        } else {
            for (const childConcept of concept.concepts) {
                const childShadow = { [sc.SELF]: key };
                castShadow(childShadow, schema[key], childConcept);

                arrayify.pushOrSet(shadow, childConcept[sc.SELF], childShadow);
            }
        }
    }
}

module.exports = { Schema };

const { Concepts } = require('./concepts');
const { Concept } = require('./concept');
const { sc, error, metaData, arrayify, required, loadJSON } = require('./util');
