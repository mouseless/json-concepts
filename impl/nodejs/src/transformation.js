class Transformation {
    static async load(
        pathOrObject = required('pathOrObject'),
        source = null,
        target = null
    ) {
        const object = await loadJSON(pathOrObject);

        return new Transformation(object, source, target);
    }

    #object;
    #source;
    #target;

    constructor(object, source, target) {
        this.#object = object;
        this.#source = source;
        this.#target = target;
    }

    get object() {
        return this.#object;
    }

    /**
     * 
     * @param {Schema} schema 
     * 
     * @returns {Schema}
     */
    transform(schema) {
        return transform(schema.shadow, this.#target._root, this.#object);
    }
}

function transform(schema, target, transformation, context = {}) {
    if (target.hasVariable()) {
        const result = [];

        for (const variable of target.variables) {
            result.push(context[variable.name]);
        }

        return result.length == 1 ? result[0] : result;
    }

    const result = {};

    for (const literal of target.literals) {
        result[literal.name] = transform(schema, literal, transformation, context);
    }

    for (const concept of target.concepts) {
        const query = transformation[concept.name];

        const sources = arrayify.get(schema, query.from);
        for (const source of sources) {
            result[source[sc.SELF]] = {};

            const subContext = {};
            for (const targetKey in query.select) {
                const sourceKey = query.select[targetKey];

                subContext[targetKey] = source[sourceKey];
            }

            result[source[sc.SELF]] = transform(source, concept, transformation, subContext);
        }
    }

    return result;
}

module.exports = {
    Transformation
};

const { sc, arrayify, required, loadJSON } = require('./util');
const { Schema } = require('./schema');
const { Concept } = require('./concept');