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
        const definition = await loadJSON(path);

        return new Transformation(definition, source, target);
    }

    /* const */ #definition;
    /* const */ #source;
    /* const */ #target;
    /* const */ #queriesMap;

    /**
     * Transformation represents a set of transformation rules from one
     * concepts (source) to another (target). Once created, you can use it to
     * transform any schema of source concepts to target concepts.
     * 
     * This constructor validates definition against given source and target
     * concepts, and builds queries from given definition.
     * 
     * @param {Object} definition Transformation definition
     * @param {Concepts} source Source concepts
     * @param {Concepts} target Target concepts
     */
    constructor(
        definition = required('definition'),
        source = required('source'),
        target = required('target')
    ) {
        this.#definition = definition;
        this.#source = source;
        this.#target = target;

        this.#queriesMap = {};
        this._build();
    }

    /**
     * Definition that represents the transformation. This definition has query
     * definitions for at least one concept in target concepts.
     * 
     * @returns {Object}
     */
    get definition() { return this.#definition; }

    /**
     * Transforms given schema in source concepts to target concepts. Schema is
     * validated against source concepts before transformation.
     * 
     * @param {Schema|Object} schema (Required) The schema to be transformed. 
     * You can pass a schema object directly, it will be converted to a Schema
     * from source concepts.
     * 
     * @returns {Schema} Target version of given schema
     */
    transform(schema = required('schema')) {
        if (!(schema instanceof Schema)) {
            schema = this.#source.create(schema);
        } else {
            if (!this.#source.validate(schema.definition)) {
                throw error.SCHEMA_is_not_valid(schema.definition);
            }
        }

        return this.#target.create(
            this._transform(schema._shadow, this.#target._shadow)
        );
    }

    _build() {
        for (const concept in this.#definition) {
            this.#queriesMap[concept] = [];

            const queries = arrayify.get(this.#definition, concept);
            for (const definition of queries) {
                const query = new Query(definition);

                this.#queriesMap[concept].push(query);
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
                query.execute(schema, function (childSchema, childContext) {
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

const { error, arrayify, required, loadJSON } = require('./util');
const { Concepts } = require('./concepts');
const { Schema } = require('./schema');
const { Query } = require('./query');
