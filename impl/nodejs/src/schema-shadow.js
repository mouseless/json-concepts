class SchemaShadow {
    /* const */ #conceptsShadow;
    /* const */ #name;
    /* const */ #variables;
    /* const */ #variableMap;
    /* const */ #schemas;
    /* const */ #schemaMap;
    /* const */ #data;

    constructor(conceptsShadow, name) {
        this.#conceptsShadow = conceptsShadow;
        this.#name = name;

        this.#variables = [];
        this.#variableMap = {};
        this.#schemas = [];
        this.#schemaMap = {};
        this.#data = {};
    }

    get name() { return this.#name; }
    get data() { return this.#data; }

    hasVariable(name) { return this.#variableMap.hasOwnProperty(name); }
    getVariable(name) { return this.#variableMap[name]; }
    hasSchema(name) { return this.#schemaMap.hasOwnProperty(name); }
    getSchema(name) { return arrayify.get(this.#schemaMap, name); }

    build(schema) {
        this._build(schema, this.#conceptsShadow);

        if (this.#name != null) {
            this.#data[sc.SELF] = this.#name;
        }

        if (this.#conceptsShadow.hasNothingButName()) {
            this.#data = schema;
        } else {
            for (const shadow of this.#variables) {
                this.#data[shadow.#conceptsShadow.name] = shadow.#data;
            }

            for (const shadow of this.#schemas) {
                arrayify.pushOrSet(this.#data, shadow.#conceptsShadow.name, shadow.#data);
            }
        }
    }

    _build(schema, conceptsShadow) {
        if (conceptsShadow.hasAnyVariables()) {
            for (const variable of conceptsShadow.variables) {
                const shadow = new SchemaShadow(variable)
                shadow.build(schema);

                this.#variables.push(shadow);
                this.#variableMap[shadow.#conceptsShadow.name] = shadow;
            }
        } else if (conceptsShadow.hasAnyConcepts() || conceptsShadow.hasAnyLiterals()) {
            for (const key in schema) {
                if (conceptsShadow.hasLiteral(key)) {
                    this._build(schema[key], conceptsShadow.getLiteral(key));
                } else {
                    for (const concept of conceptsShadow.concepts) {
                        const shadow = new SchemaShadow(concept, key);
                        shadow.build(schema[key]);

                        this.#schemas.push(shadow);
                        arrayify.pushOrSet(this.#schemaMap, shadow.#conceptsShadow.name, shadow);
                    }
                }
            }
        }
    }
}

module.exports = {
    SchemaShadow
};

const { sc, arrayify } = require('./util');