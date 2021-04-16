class SchemaShadow {
    /* const */ #conceptsShadow;
    /* const */ #name;
    /* const */ #variables;
    /* const */ #variableMap;
    /* const */ #schemas;
    /* const */ #schemaMap;
    /* const */ #data;

    /**
     * SchemaShadow is a traversable tree version of a schema. It also
     * represents any node in that tree.
     * 
     * This constructor only initializes this node. It should be built after
     * its construction.
     * 
     * @param {ConceptsShadow} conceptsShadow (Required) Corresponding concepts
     * shadow of this node.
     * @param {String} name Name of this node
     */
    constructor(
        conceptsShadow = required('conceptsShadow'),
        name
    ) {
        this.#conceptsShadow = conceptsShadow;
        this.#name = name;

        this.#variables = [];
        this.#variableMap = {};
        this.#schemas = [];
        this.#schemaMap = {};
        this.#data = {};
    }

    /**
     * Name of this node.
     * 
     * @returns {String}
     */
    get name() { return this.#name; }
    /**
     * Data representation of this node and all of is nodes under it as an
     * object.
     * 
     * @returns {Object}
     */
    get data() { return this.#data; }

    /**
     * Helper method to check if this node has a variable child node with given
     * name.
     * 
     * @param {String} name (Required) Variable name to check 
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasVariable(name = required('name')) { return this.#variableMap.hasOwnProperty(name); }
    /**
     * Helper method to get the variable node with given name.
     * 
     * @param {String} name (Required) Variable name to get
     * 
     * @returns {SchemaShadow} Variable node with given name under this node
     */
    getVariable(name = required('name')) { return this.#variableMap[name]; }
    /**
     * Helper method to check if this node has any schema child node with given
     * name.
     * 
     * @param {String} name (Required) Schema name to check 
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasSchemas(name = required('name')) { return this.#schemaMap.hasOwnProperty(name); }
    /**
     * Helper method to get schema nodes with given name.
     * 
     * @param {String} name (Required) Schema name to get
     * 
     * @returns {Array.<SchemaShadow>} Schema nodes with given name under this
     * node.
     */
    getSchemas(name = required('name')) { return arrayify.get(this.#schemaMap, name); }

    /**
     * Recursively builds this node using given schema object.
     * 
     * @param {Object} schema (Required) Schema object
     */
    build(schema = required('schema')) {
        this._build(schema, this.#conceptsShadow);

        if (this.#name != null) {
            this.#data[SC.SELF.value] = this.#name;
        }

        if (this.#conceptsShadow.hasNothingButName()) {
            this.#data = schema;
        } else {
            for (const shadow of this.#variables) {
                this.#data[shadow.#conceptsShadow.name] = shadow.#data;
            }

            for (const shadow of this.#schemas) {
                arrayify.push(this.#data, shadow.#conceptsShadow.name, shadow.#data);
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
                        arrayify.push(this.#schemaMap, shadow.#conceptsShadow.name, shadow);
                    }
                }
            }
        }
    }
}

module.exports = {
    SchemaShadow
};

const { SpecialCharacters: SC, arrayify, required } = require('./util');