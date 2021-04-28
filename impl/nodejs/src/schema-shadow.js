class SchemaShadow {
    /* const */ #conceptsShadow;
    /* const */ #name;
    /* const */ #variables;
    /* const */ #variablesArray;
    /* const */ #schemasByConcept;

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
        this.#variablesArray = [];
        this.#schemasByConcept = {};
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
    getSchemas(name = required('name')) { return this.#schemasByConcept[name]; }

    /**
     * Recursively builds this node using given schema definition.
     * 
     * @param {Object} definition Schema definition
     */
    build(definition) {
        definition = arrayify.make(this.#conceptsShadow.dimensions, definition);

        if (this.#conceptsShadow.isLeafNode()) {
            this.#data = definition;
        } else if (this.#conceptsShadow.dimensions > 0) {
            this._build(this.#conceptsShadow, definition);

            this.#data = [];
            arrayify.each(this.#variablesArray, (item, indices) => {

                const obj = {};
                for (const name in item) {
                    const shadow = item[name];

                    obj[name] = shadow.#data;
                }
                arrayify.set(this.#data, indices, obj);
            });
        } else {
            this._build(this.#conceptsShadow, definition);

            this.#data = {};

            if (this.#name != null) {
                this.#data[SC.SELF] = this.#name;
            }

            for (const name in this.#variables) {
                const shadow = this.#variables[name];

                this.#data[name] = shadow.#data;
            }

            for (const concept in this.#schemasByConcept) {
                const schemas = this.#schemasByConcept[concept];

                const conceptShadow = this.#conceptsShadow.getConcept(concept)
                this.#data[concept] = conceptShadow.allowsMultiple ? [] : null;

                if (conceptShadow.allowsMultiple) {
                    for (const shadow of schemas) {
                        this.#data[concept].push(shadow.#data);
                    }
                } else if (schemas.length > 0) {
                    this.#data[concept] = schemas[0].#data;
                }
            }
        }

        return this;
    }

    /**
     * @param {ConceptsShadow} conceptsShadow 
     * @param {Object} definition
     * @param {Array.<Number>} indices
     */
    _build(
        conceptsShadow = required('conceptsShadow'),
        definition,
        indices
    ) {
        if (conceptsShadow.hasOnlyVariableLeafNode()) {
            const shadow = new SchemaShadow(conceptsShadow.variable).build(definition);

            if (indices) {
                let variables = arrayify.getM(this.#variablesArray, indices, {});

                variables[conceptsShadow.variable.name] = shadow;
            } else {
                this.#variables[conceptsShadow.variable.name] = shadow;
            }

            return;
        }

        if (conceptsShadow.variable != null) {
            const shadow = new SchemaShadow(conceptsShadow.variable).build(definition)
            this.#variables[conceptsShadow.name] = shadow;

            return;
        }

        if (conceptsShadow.dimensions > 0) {
            arrayify.each(definition, (item, indices) => {
                const keys = {};
                if (item != null) {
                    Object.keys(item).forEach(key => keys[key] = true);
                }

                for (const literal of conceptsShadow.literals) {
                    if (keys[literal.name]) {
                        this._build(literal, item[literal.name], indices);

                        delete keys[literal.name];
                    } else {
                        this._build(literal, null, indices);
                    }
                }
            });

            return;
        }

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
            this.#schemasByConcept[concept.name] = [];
            for (const key of Object.keys(keys)) {
                try {
                    concept.validate(definition[key]);
                    const shadow = new SchemaShadow(concept, key).build(definition[key]);

                    this.#schemasByConcept[concept.name].push(shadow);

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

module.exports = SchemaShadow;

const ConceptsShadow = require('./concepts-shadow');
const { SpecialCharacters: SC, error, arrayify, required } = require('./util');
