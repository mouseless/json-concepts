class Query {
    /* const */ #object;

    constructor(object) {
        this.#object = object;
    }

    /**
     * 
     * @param {SchemaShadow} schema
     * 
     * @returns {Array.<SchemaShadow>}
     */
    from(schema) {
        if (!schema.hasSchema(this.#object.from)) {
            return [];
        }

        return schema.getSchema(this.#object.from);
    }

    /**
     * 
     * @param {Schema} schema 
     * 
     * @returns {Object}
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