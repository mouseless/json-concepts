class ShadowSchema {
    /* const */ #shadowConcepts;
    /* const */ #name;
    /* const */ #schemas;
    /* const */ #variables;
    /* const */ #data;

    constructor(shadowConcepts, name) {
        this.#shadowConcepts = shadowConcepts;
        this.#name = name;

        this.#variables = [];
        this.#schemas = [];
        this.#data = {};
    }

    get name() { return this.#name; }
    get data() { return this.#data; }

    build(schema, shadowConcepts = null) {
        this._build(schema, shadowConcepts || this.#shadowConcepts)

        if (this.#name != null) {
            this.#data[sc.SELF] = this.#name;
        }

        for (const variable of this.#variables) {
            this.#data[variable.#shadowConcepts.name] = variable.name;
        }

        for (const childSchema of this.#schemas) {
            arrayify.pushOrSet(this.#data, childSchema.#shadowConcepts.name, childSchema.#data);
        }
    }

    _build(schema, shadowConcepts) {
        if (shadowConcepts.hasVariable()) {
            for (const variable of shadowConcepts.variables) {
                this.#variables.push(new ShadowSchema(variable, schema));
            }
        } else {
            for (const key in schema) {
                if (shadowConcepts.hasLiteral(key)) {
                    this._build(schema[key], shadowConcepts.getLiteral(key));
                } else {
                    for (const concept of shadowConcepts.concepts) {
                        const childSchema = new ShadowSchema(concept, key);

                        childSchema.build(schema[key]);

                        this.#schemas.push(childSchema);
                    }
                }
            }
        }
    }
}

module.exports = {
    ShadowSchema
};

const { sc, arrayify } = require('./util');