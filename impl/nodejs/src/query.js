class Query {
    /**
     * Data that represents a concept
     * 
     * @typedef {Object} Concept
     * @property {Object} variables
     * 
     * @see Concepts
     */

    /* const */ #definition;

    /**
     * Query represents a single transformation definition from one concept to
     * another.
     * 
     * This constructor initializes a Query instance with given definition from
     * a transformation.
     * 
     * @param {Object} definition Query definition from a transformation
     */
    constructor(definition) {
        this.#definition = definition;
    }

    /**
     * Validates this query against given target concept and source concepts.
     * An error will be thrown if validation fails.
     * 
     * @param {Concept} targetConcept Target concept data. Pass the concept
     * data to which result of this query will be set.
     * @param {Concepts} source Source concepts from which this query will
     * fetch its result.
     */
    validate(targetConcept, source) {
        if (!source.has(this.#definition.from)) {
            throw error.Definition_is_not_compatible_with_its_CONCEPTS__because__REASON(
                'source', reason => reason.CONCEPT_not_found(this.#definition.from)
            );
        }

        const sourceConcept = source.get(this.#definition.from);
        for (const targetVariable in this.#definition.select) {
            const sourceVariable = this.#definition.select[targetVariable];

            if (!targetConcept.variables.hasOwnProperty(targetVariable)) {
                throw error.Definition_is_not_compatible_with_its_CONCEPTS__because__REASON(
                    'target', reason => reason.VARIABLE_not_found(targetVariable)
                );
            }

            if (!sourceConcept.variables.hasOwnProperty(sourceVariable)) {
                throw error.Definition_is_not_compatible_with_its_CONCEPTS__because__REASON(
                    'source', reason => reason.VARIABLE_not_found(sourceVariable)
                );
            }
        }
    }

    /**
     * Executed for each source found in given schema.
     * 
     * @callback executeCallback
     * @param {Object} childSchema Child schema found in given schema
     * @param {Object} variableContext Projected variable context 
     */
    /**
     * Finds list of schemas and projects them into a variable context for the
     * target schema. For every child schema calls back given function with
     * child schema and projected variable context.
     * 
     * @param {Object} schema Schema on which this query will be executed
     * @param {executeCallback} callback  Function to callback for each child
     * schema.
     */
    execute(
        schema = required('schema'),
        callback = required('callback')
    ) {
        for (const source of this._from(schema)) {
            const projection = this._select(source);

            callback(source, projection);
        }
    };

    _from(schema) {
        if (!schema.hasSchemas(this.#definition.from)) {
            return [];
        }

        return schema.getSchemas(this.#definition.from);
    }

    _select(schema) {
        const projection = {};

        for (const targetKey in this.#definition.select) {
            const sourceKey = this.#definition.select[targetKey];

            if (schema.hasVariable(sourceKey)) {
                projection[targetKey] = schema.getVariable(sourceKey).data;
            }
        }

        return projection;
    }
}

module.exports = Query;

const Concepts = require('./concepts');
const { error, required } = require('./util');
