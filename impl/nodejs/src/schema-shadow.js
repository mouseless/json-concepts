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
        this._build(this.#conceptsShadow, definition);

        if (this.#name != null) {
            this.#data[SC.SELF] = this.#name;
        }

        if (this.#conceptsShadow.isLeafNode()) {
            this.#data = definition;
        } else {
            for (const shadow of this.variables) {
                this.#data[shadow.#conceptsShadow.name] = shadow.#data;
            }

            for (const shadow of this.#schemaArray) {
                arrayify.push(this.#data, shadow.#conceptsShadow.name, shadow.#data);
            }
        }

        return this;
    }

    _build(conceptsShadow, definition) {
        if (conceptsShadow.hasOnlyVariableLeafNode()) {
            const shadow = new SchemaShadow(conceptsShadow.variable).build(definition);
    
            this.#variables[shadow.#conceptsShadow.name] = shadow;
        } else {
            for (const key in definition) {
                if (conceptsShadow.hasLiteral(key)) {
                    this._build(conceptsShadow.getLiteral(key), definition[key]);
                } else {
                    for (const concept of conceptsShadow.concepts) {
                        const shadow = new SchemaShadow(concept, key).build(definition[key]);
                
                        arrayify.push(this.#schemas, shadow.#conceptsShadow.name, shadow);
                        this.#schemaArray.push(shadow);
                    }
                }
            }
        }
    }
}

module.exports = SchemaShadow;

const { SpecialCharacters: SC, arrayify, required } = require('./util');