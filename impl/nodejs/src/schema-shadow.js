class SchemaShadow {
    /* const */ #conceptsShadow;
    /* const */ #name;
    /* const */ #variables;
    /* const */ #schemas;
    /* const */ #schemaArray;
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

        this.#variables = {};
        this.#schemas = {};
        this.#schemaArray = [];
        this.#data = {};
    }

    /**
     * Name of this node.
     * 
     * @returns {String}
     */
    get name() { return this.#name; }
    /**
     * Array of variable nodes under this node.
     * 
     * @returns {Array.<SchemaShadow>}
     */
    get variables() { return Object.values(this.#variables); }
    /**
     * Array of schema nodes under this node.
     * 
     * @returns {Array.<SchemaShadow>}
     */
    get schemas() { return this.#schemaArray; }
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
    hasVariable(name = required('name')) { return this.#variables.hasOwnProperty(name); }
    /**
     * Helper method to get the variable node with given name.
     * 
     * @param {String} name (Required) Variable name to get
     * 
     * @returns {SchemaShadow} Variable node with given name under this node
     */
    getVariable(name = required('name')) { return this.#variables[name]; }
    /**
     * Helper method to check if this node has any schema child node with given
     * name.
     * 
     * @param {String} name (Required) Schema name to check 
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasSchemas(name = required('name')) { return this.#schemas.hasOwnProperty(name); }
    /**
     * Helper method to get schema nodes with given name.
     * 
     * @param {String} name (Required) Schema name to get
     * 
     * @returns {Array.<SchemaShadow>} Schema nodes with given name under this
     * node.
     */
    getSchemas(name = required('name')) { return arrayify.get(this.#schemas, name); }

    /**
     * Recursively builds this node using given schema definition.
     * 
     * @param {Object} definition (Required) Schema definition
     */
    build(definition = required('definition')) {
        this._build(definition, this.#conceptsShadow);

        if (this.#name != null) {
            this.#data[SC.SELF.value] = this.#name;
        }

        if (this.#conceptsShadow.hasNothingButName()) {
            this.#data = definition;
        } else {
            for (const shadow of this.variables) {
                this.#data[shadow.#conceptsShadow.name] = shadow.#data;
            }

            for (const shadow of this.#schemaArray) {
                arrayify.push(this.#data, shadow.#conceptsShadow.name, shadow.#data);
            }
        }
    }

    _build(definition, conceptsShadow) {
        if (conceptsShadow.hasAnyVariables()) {
            for (const variable of conceptsShadow.variables) {
                this._pushVariable(definition, variable);
            }
        } else if (conceptsShadow.hasAnyConcepts() || conceptsShadow.hasAnyLiterals()) {
            for (const key in definition) {
                if (conceptsShadow.hasLiteral(key)) {
                    this._build(definition[key], conceptsShadow.getLiteral(key));
                } else {
                    for (const concept of conceptsShadow.concepts) {
                        this._pushSchema(definition[key], concept, key);
                    }
                }
            }
        }
    }

    _pushVariable(definition, variable) {
        const shadow = new SchemaShadow(variable)
        shadow.build(definition);

        this.#variables[shadow.#conceptsShadow.name] = shadow;
    }

    _pushSchema(definition, concept, key) {
        const shadow = new SchemaShadow(concept, key);
        shadow.build(definition);

        arrayify.push(this.#schemas, shadow.#conceptsShadow.name, shadow);
        this.#schemaArray.push(shadow);
    }
}

module.exports = {
    SchemaShadow
};

const { SpecialCharacters: SC, arrayify, required } = require('./util');