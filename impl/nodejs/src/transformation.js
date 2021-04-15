/* exported */ class Transformation {
    static async load(
        pathOrObject = required('pathOrObject'),
        source = null,
        target = null
    ) {
        const object = await loadJSON(pathOrObject);

        return new Transformation(object, source, target);
    }

    /* const */ #object;
    /* const */ #source;
    /* const */ #target;

    constructor(object, source, target) {
        this.#object = object;
        this.#source = source;
        this.#target = target;
    }

    get object() { return this.#object; }

    /**
     * 
     * @param {Schema} schema 
     * 
     * @returns {Schema}
     */
    transform(schema) {
        return this.#target.create(
            _transform(schema._shadow, this.#target._shadow, this.#object)
        );
    }
}

function _transform(schema, target, transformation, context = {}) {
    if (target.hasAnyVariables()) {
        const result = [];

        for (const variable of target.variables) {
            result.push(context[variable.name]);
        }

        return result.length == 1 ? result[0] : result;
    }

    const result = {};
    for (const literal of target.literals) {
        result[literal.name] = _transform(schema, literal, transformation, context);
    }

    for (const concept of target.concepts) {
        const query = transformation[concept.name];

        if (schema.hasSchema(query.from)) {
            for (const source of schema.getSchema(query.from)) {
                result[source.name] = {};

                const subContext = {};
                for (const targetKey in query.select) {
                    const sourceKey = query.select[targetKey];

                    subContext[targetKey] = source.getVariable(sourceKey).data;
                }

                result[source.name] = _transform(source, concept, transformation, subContext);
            }
        }
    }

    return result;
}

module.exports = {
    Transformation
};

const { sc, arrayify, required, loadJSON } = require('./util');
const { Schema } = require('./schema');
