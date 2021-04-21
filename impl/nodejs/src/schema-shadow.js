class SchemaShadow {
    /* const */ #conceptsShadow;
    /* const */ #name;
    /* const */ #variables;
    /* const */ #schemas;

    /* let */ #data;

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
     * Data representation of this node and all of is nodes under it as an
     * object.
     * 
     * @returns {Object}
     */
    get data() { return Object.freeze(this.#data); }

    /**
     * Helper method to get the variable node with given name.
     * 
     * @param {String} name (Required) Variable name to get
     * 
     * @returns {SchemaShadow} Variable node with given name under this node
     */
    getVariable(name = required('name')) { return this.#variables[name]; }
    /**
     * Helper method to get schema nodes with given name.
     * 
     * @param {String} name (Required) Schema name to get
     * 
     * @returns {Array.<SchemaShadow>} Schema nodes with given name under this
     * node.
     */
    getSchemas(name = required('name')) { return Object.freeze(this.#schemas[name]); }

    /**
     * Recursively builds this node using given schema definition.
     * 
     * @param {Object} definition Schema definition
     */
    build(definition) {
        if (this.#conceptsShadow.isLeafNode()) {
            this.#data = definition;
        } else {
            this._build(this.#conceptsShadow, definition);

            this.#data = {};

            if (this.#name != null) {
                this.#data[SC.SELF] = this.#name;
            }

            for (const shadow of this.variables) {
                this.#data[shadow.#conceptsShadow.name] = shadow.#data;
            }

            for (const concept in this.#schemas) {
                const schemas = this.#schemas[concept];
                if (schemas.length == 0) {
                    this.#data[concept] = null;
                } else {
                    for (const shadow of schemas) {
                        arrayify.push(this.#data, concept, shadow.#data);
                    }
                }
            }
        }

        return this;
    }

    /**
     * @param {ConceptsShadow} conceptsShadow 
     * @param {Object} definition 
     */
    _build(
        conceptsShadow = required('conceptsShadow'),
        definition
    ) {
        if (conceptsShadow.hasOnlyVariableLeafNode()) {
            const shadow = new SchemaShadow(conceptsShadow.variable).build(definition);

            this.#variables[conceptsShadow.variable.name] = shadow;
        } else {
            const keys = {};
            if (definition != null) {
                Object.keys(definition).forEach(key => keys[key] = true);
            }

            for (const literal of conceptsShadow.literals) {
                if (keys[literal.name]) {
                    this._build(literal, definition[literal.name]);

                    delete keys[literal.name];
                } else {
                    this._build(literal, null);
                }
            }

            for (const concept of conceptsShadow.concepts) {
                this.#schemas[concept.name] = [];
                for (const key of Object.keys(keys)) {
                    try {
                        concept.validate(definition[key]);
                        const shadow = new SchemaShadow(concept, key).build(definition[key]);
                        this.#schemas[concept.name].push(shadow);

                        delete keys[key];
                    } catch (e) {
                        if (e.name == error.Names.SCHEMA_ERROR) {
                            // this means that this concept should not handle this key,
                            // so it is safe to skip this one
                            continue;
                        }

                        throw e;
                    }
                }
            }
        }
    }
}

module.exports = SchemaShadow;

const ConceptsShadow = require('./concepts-shadow');
const { SpecialCharacters: SC, error, arrayify, required } = require('./util');