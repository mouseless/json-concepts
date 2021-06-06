class SchemaShadow {
    /* const */ #conceptsShadow;
    /* const */ #name;
    /* const */ #variables;
    /* const */ #schemasByConcept;

    /* let */ #data;

    /**
     * SchemaShadow is a traversable tree version of a schema. It also
     * represents any node in that tree.
     * 
     * This constructor only initializes this node. It should be built after
     * its construction.
     * 
     * @param {ConceptsShadow_} conceptsShadow (Required) Corresponding concepts
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
        if (this.#conceptsShadow.isLeafNode()) {
            this.#data = arrayify.make(this.#conceptsShadow.dimensions, definition);
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

                const conceptShadow = this.#conceptsShadow.getConcept(concept);
                if (conceptShadow) {
                    this.#data[concept] = conceptShadow.allowsMultiple ? [] : null;

                    if (conceptShadow.allowsMultiple) {
                        for (const shadow of schemas) {
                            this.#data[concept].push(shadow.#data);
                        }
                    } else if (schemas.length > 0) {
                        this.#data[concept] = schemas[0].#data;
                    }
                } else {
                    this.#data[concept] = [];
                    arrayify.each(schemas, (item, indices) => {
                        arrayify.set(this.#data[concept], indices, item.#data);
                    });
                }
            }
        }

        return this;
    }

    /**
     * @param {ConceptsShadow_} conceptsShadow 
     * @param {Object} definition
     * @param {Array.<Number>} indices
     */
    _build(
        conceptsShadow = required('conceptsShadow'),
        definition,
        _trace = new Set()
    ) {
        if (_trace.has(conceptsShadow)) {
            return;
        }

        _trace.add(conceptsShadow);

        if (conceptsShadow.hasOnlyVariableLeafNode()) {
            const shadow = new SchemaShadow(conceptsShadow.variable).build(definition);
            this.#variables[conceptsShadow.variable.name] = shadow;

            return;
        }

        if (conceptsShadow.hasOnlyVariableNode()) {
            this.#schemasByConcept[conceptsShadow.name] = [];

            definition = arrayify.make(conceptsShadow.variable.dimensions, definition);
            arrayify.each(definition, (item, indices) => {
                const shadow = new SchemaShadow(conceptsShadow.variable).build(item);
                arrayify.set(this.#schemasByConcept[conceptsShadow.name], indices, shadow);
            });

            return;
        }

        const schemaKeys = SchemaKey.parseKeys(definition, conceptsShadow);

        for (const literal of conceptsShadow.literals) {
            if (schemaKeys[literal.name]) {
                this._build(literal, definition[literal.name], _trace);

                delete schemaKeys[literal.name];
            } else {
                this._build(literal, null, _trace);
            }
        }

        for (const concept of conceptsShadow.concepts) {
            this.#schemasByConcept[concept.name] = [];
            for (const key in schemaKeys) {
                /** @type {import('./schema-key').SchemaKeyObject} */
                const schemaKey = schemaKeys[key];

                if (!schemaKey.mightBelongTo(concept)) {
                    continue;
                }

                try {
                    concept.validate(definition[key]);
                    const shadow = new SchemaShadow(concept, schemaKey.name).build(definition[key]);

                    this.#schemasByConcept[concept.name].push(shadow);

                    delete schemaKeys[key];
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

const ConceptsShadow_ = require('./concepts-shadow');
const SchemaKey = require('./schema-key');
const { SpecialCharacters: SC, error, arrayify, required } = require('./util');
