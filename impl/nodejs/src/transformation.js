/* exported */ class Transformation {
    /**
     * Loads transformation from given path.
     * 
     * @async
     * @param {String} path (Required) File path or URL referring to a json
     * content.
     * @param {Concepts} source Source concepts to transform from
     * @param {Concepts} target Target concepts to transform to
     * 
     * @returns {Promise<Transformation>} Transformation at given path
     */
    static async load(
        path = required('path'),
        source = null,
        target = null
    ) {
        const object = await loadJSON(path);

        return new Transformation(object, source, target);
    }

    /* const */ #object;
    /* const */ #source;
    /* const */ #target;
    /* const */ #queriesMap;

    /**
     * Transformation represents a set of transformation rules from one
     * concepts (source) to another (target). Once created, you can use it to
     * transform any schema of source concepts to target concepts.
     * 
     * This constructor validates object against given source and target
     * concepts, and builds queries from given object.
     * 
     * @param {Object} object Transformation object
     * @param {Concepts} source Source concepts
     * @param {Concepts} target Target concepts
     */
    constructor(object, source, target) {
        this.#object = object;
        this.#source = source;
        this.#target = target;

        this.#queriesMap = {};
        this._build();
    }

    /**
     * Object that represents the transformation. This object has query
     * definitions for at least one concept in target concepts.
     * 
     * @returns {Object}
     */
    get object() { return this.#object; }

    /**
     * Transforms given schema in source concepts to target concepts. Schema is
     * validated against source concepts before transformation.
     * 
     * @param {Schema|Object} schema The schema to be transformed. You can pass
     * a schema object directly, it will be converted to a Schema from source
     * concepts.
     * 
     * @returns {Schema} Target version of given schema
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
                const $this = this;
                query.execute(schema, function(childSchema, childContext) {
                    result[childSchema.name] = $this._transform(childSchema, concept, childContext);
                });
            }
        }

        return result;
    }
}

module.exports = {
    Transformation
};

const { arrayify, required, loadJSON } = require('./util');
const { Concepts } = require('./concepts');
const { Schema } = require('./schema');
const { Query } = require('./query');
