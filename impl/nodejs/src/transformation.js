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
    /* const */ #queriesMap;

    constructor(object, source, target) {
        //todo validate conformance

        this.#object = object;
        this.#source = source;
        this.#target = target;

        this.#queriesMap = {};
        this._build();
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
            this._transform(schema._shadow, this.#target._shadow)
        );
    }

    _build() {
        for (const concept in this.#object) {
            this.#queriesMap[concept] = [];

            const queries = arrayify.get(this.#object, concept);
            for (const query of queries) {
                this.#queriesMap[concept].push(new Query(query));
            }
        }
    }

    _transform(schema, target, context = {}) {
        if (target.hasAnyVariables()) {
            const result = [];

            for (const variable of target.variables) {
                if (context.hasOwnProperty(variable.name)) {
                    result.push(context[variable.name]);
                }
            }

            return result.length > 1
                ? result
                : result.length > 0
                    ? result[0]
                    : null;
        }

        const result = {};
        for (const literal of target.literals) {
            result[literal.name] = this._transform(schema, literal, context);
        }

        for (const concept of target.concepts) {
            for (const query of this.#queriesMap[concept.name]) {
                for (const childSchema of query.from(schema)) {
                    const childContext = query.select(childSchema);

                    result[childSchema.name] = this._transform(childSchema, concept, childContext);
                }
            }
        }

        return result;
    }
}

module.exports = {
    Transformation
};

const { arrayify, required, loadJSON } = require('./util');
const { Schema } = require('./schema');
const { Query } = require('./query');
