class Query {
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

module.exports = {
    Query
};

const { required } = require('./util');
