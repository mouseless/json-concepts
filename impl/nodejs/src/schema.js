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

            build(this.#shadow, this.#object, this.#concepts._root);
        }

        return this.#shadow;
    }
}

function build(shadow, schema, concept) {
    if (concept.hasVariable()) {
        for (const variable of concept.variables) {
            arrayify.pushOrSet(shadow, variable.name, schema);
        }
        return;
    }

    for (const key in schema) {
        if (concept.hasLiteral(key)) {
            build(shadow, schema[key], concept.getLiteral(key));
        } else {
            for (const childConcept of concept.concepts) {
                const childShadow = { [sc.SELF]: key };
                build(childShadow, schema[key], childConcept);

                arrayify.pushOrSet(shadow, childConcept.name, childShadow);
            }
        }
    }
}

module.exports = { Schema };

const { Concepts } = require('./concepts');
const { sc, error, metaData, arrayify, required, loadJSON } = require('./util');
