class SchemaShadow {
    /* const */ #conceptsShadow;
    /* const */ #name;
    /* const */ #schemas;
    /* const */ #variables;
    /* const */ #data;

    constructor(conceptsShadow, name) {
        this.#conceptsShadow = conceptsShadow;
        this.#name = name;

        this.#variables = [];
        this.#schemas = [];
        this.#data = {};
    }

    get name() { return this.#name; }
    get data() { return this.#data; }

    build(schema) {
        this._build(schema, this.#conceptsShadow);

        if (this.#name != null) {
            this.#data[sc.SELF] = this.#name;
        }

        if(this.#conceptsShadow.hasNothingButName()) {
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
            }
        } else if(conceptsShadow.hasAnyConcepts() || conceptsShadow.hasAnyLiterals()){
            for (const key in schema) {
                if (conceptsShadow.hasLiteral(key)) {
                    this._build(schema[key], conceptsShadow.getLiteral(key));
                } else {
                    for (const concept of conceptsShadow.concepts) {
                        const shadow = new SchemaShadow(concept, key);
                        shadow.build(schema[key]);

                        this.#schemas.push(shadow);
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