class Query {
    /* const */ #object;

    /**
     * Query represents a single transformation definition from one concept to
     * another.
     * 
     * This constructor initializes a Query instance with given object from a
     * transformation definition.
     * 
     * @param {Object} object Object from a transformation definition
     */
    constructor(object) {
        this.#object = object;
    }

    /**
     * Finds and returns list of schemas to select from.
     * 
     * @param {SchemaShadow} schema Root schema node to search child schemas
     * 
     * @returns {Array.<SchemaShadow>} Found array of schema nodes
     */
    from(schema) {
        if (!schema.hasSchemas(this.#object.from)) {
            return [];
        }

        return schema.getSchemas(this.#object.from);
    }

    /**
     * Projects a given schema into a variable context for the target schema.
     * 
     * @param {Schema} schema Schema to project
     * 
     * @returns {Object} Projected variable context
     */
    select(schema) {
        const result = {};

        for (const targetKey in this.#object.select) {
            const sourceKey = this.#object.select[targetKey];

            if(schema.hasVariable(sourceKey)) {
                result[targetKey] = schema.getVariable(sourceKey).data;
            }
        }

        return result;
    }
}

module.exports = {
    Query
};

const { SchemaShadow } = require('./schema-shadow');