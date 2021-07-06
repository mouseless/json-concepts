/** @private */ class ConceptsShadow {
    /* const */ #expression;
    /* const */ #dimensions;
    /* const */ #variable;
    /* const */ #literals;
    /* const */ #concepts;
    /* const */ #data;

    /* let */ #referring;

    /**
     * ConceptsShadow is a traversable tree version of a concepts definition.
     * It also represents any node in that tree.
     * 
     * This constructor only initializes a shadow instance. It should be built
     * after construction.
     * 
     * @param {Expression} expression Expression of this node. It should be
     * `undefined` for root node and object array nodes.
     * @param {Number} dimensions (Default: 0) Allowed number of dimensions for
     * this node.
     */
    constructor(expression, dimensions = 0) {
        this.#expression = expression;
        this.#dimensions = dimensions;

        this.#variable = null;
        this.#literals = {};
        this.#concepts = {};
        this.#data = {};
        this.#referring = false;
    }

    /**
     * Checks if this node has variable expression.
     * 
     * @returns {Boolean} `true` if it has, `false` otherwise
     */
    get isVariable() { return this.#expression != null && this.#expression.isVariable; }
    /**
     * Checks if this node has literal expression.
     * 
     * @returns {Boolean} `true` if it has, `false` otherwise
     */
    get isLiteral() { return this.#expression != null && this.#expression.isLiteral; }
    /**
     * Name of this node. `undefined` for root node.
     * 
     * @returns {String}
     */
    get name() { return this.#expression != null ? this.#expression.name : null; }
    /**
     * Quantifier definition of this node. Result is either null or an object
     * with min and max values.
     * 
     * @returns {import('./expression').QuantifierData}
     */
    get quantifier() { return this.#expression != null ? this.#expression.quantifier : null; }
    /**
     * Checks if this node allows more than one instance.
     * 
     * @returns {Boolean} `true` if it is, `false` otherwise
     */
    get allowsMultiple() { return this.#expression != null && this.#expression.allowsMultiple; }
    /**
     * Variable type of this node. Available only when this node is a variable.
     * 
     * @returns {import('./types').TypeData}
     */
    get type() { return this.#expression != null ? this.#expression.type : null; }
    /**
     * Number of array dimensions allowed for this node. Zero for non-arrays.
     * 
     * @returns {Number}
     */
    get dimensions() { return this.#dimensions; }
    /**
     * Variable node under this node.
     * 
     * @returns {ConceptsShadow}
     */
    get variable() { return this.#variable; }
    /**
     * Array of literal nodes under this node.
     * 
     * @returns {Array.<ConceptsShadow>}
     */
    get literals() { return Object.values(this.#literals); }
    /**
     * Array of concept nodes under this node.
     * 
     * @returns {Array.<ConceptsShadow>}
     */
    get concepts() { return Object.values(this.#concepts); }

    /**
     * Data representation of this node and all of is nodes under it as an
     * object.
     * 
     * @returns {Object}
     */
    get data() {
        if (this.#referring) {
            this.#referring = false;

            return { reference: this.name };
        }

        return this.#data;
    }

    /**
     * Makes a deep search and returns all variables in the tree.
     * 
     * @returns {import('./concepts').VariablesData} Variables as key value
     * pairs.
     */
    getAllVariables() { return this._variables(this.name); }
    /**
     * Gets child concept node with given name. It returns `undefined` when no
     * child concept with given name exists.
     * 
     * @param {String} (Required) Name of child concept node
     * 
     * @returns {ConceptsShadow}
     */
    getConcept(name = required('name')) { return this.#concepts[name]; }

    /**
     * Helper method to check if this node is a leaf node.
     * 
     * @returns {boolean} `true` if it is, `false` otherwise
     */
    isLeafNode() {
        return this.variable == null &&
            this.literals.length == 0 &&
            this.concepts.length == 0;
    }

    /**
     * Checks if this node has only one variable leaf node.
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasOnlyVariableNode() {
        return this.variable != null &&
            this.literals.length == 0 &&
            this.concepts.length == 0;
    }

    /**
     * Checks if this node has only one variable leaf node.
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasOnlyVariableLeafNode() {
        return this.hasOnlyVariableNode() &&
            this.variable.isLeafNode();
    }

    /**
     * Checks if this node has only a literal leaf node.
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasOnlyLiteralLeafNode() {
        return this.variable == null &&
            this.literals.length == 1 &&
            this.literals[0].isLeafNode() &&
            this.concepts.length == 0;
    }

    /**
     * Recursively builds this node using given concepts definition. When no
     * definition is given, it means this node is a leaf node.
     * 
     * @param {Object} definition Concepts definition
     * @param {Object.<string, import('./types').TypeData>} types Types map
     * 
     * @return {ConceptsShadow} Itself after build
     */
    build(definition, types, _trace = new Trace()) {
        const traceKey = definition;

        /** @type {ConceptsShadow} */
        const shadow = _trace.get(traceKey, this.name);
        if (shadow) {
            return shadow._asReference();
        }

        const dimensions = arrayify.dimensions(definition);
        while (Array.isArray(definition)) {
            if (definition.length != 1) {
                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.KEY_array_should_have_1_item__but_got_COUNT(this.name, definition.length)
                );
            }

            definition = definition[0];
        }

        if (typeof definition === 'string') {
            const expression = Expression.parseValue(definition, types);

            if (expression.isLiteral && dimensions > 0) {
                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.Expected_a_variable__but_got_a_literal__EXPRESSION(definition)
                );
            }

            const leaf = new ConceptsShadow(expression, dimensions).build();
            if (leaf.isVariable) {
                this.#variable = leaf;
            } else if (leaf.isLiteral) {
                this.#literals[leaf.name] = leaf;
            }
        } else if (typeof definition === 'object') {
            _trace.visit(traceKey, this);

            if (dimensions == 0) {
                for (const key in definition) {
                    const expression = Expression.parseKey(key, types);

                    const node = new ConceptsShadow(expression).build(definition[key], types, _trace);
                    if (node.isVariable) {
                        if (this.#concepts[node.name]) {
                            throw error.Concepts_definition_is_not_valid__REASON(
                                because => because.Cannot_declare_CONCEPT_more_than_once(node.name)
                            );
                        }

                        this.#concepts[node.name] = node;
                    } else if (node.isLiteral) {
                        this.#literals[node.name] = node;
                    }
                }
            } else {
                const node = new ConceptsShadow(undefined, dimensions).build(definition, types, _trace);

                this.#variable = node;
            }

            _trace.unvisit(traceKey, this);
        }

        if (this.name != null) {
            this.#data[SC.SELF] = this.name;
        }

        if (this.quantifier != null && this.quantifier.data != null) {
            this.#data.quantifier = this.quantifier.data;
        }

        if (this.#dimensions > 0) {
            this.#data.dimensions = this.#dimensions;
        }

        if (this.type != null && !this.type.implicit) {
            this.#data.type = this.type.name;
        }

        if (this.variable != null) {
            this.#data.variable = this.variable.data;
        }

        for (const literal of this.literals) {
            arrayify.push(this.#data, 'literal', literal.data);
        }

        for (const concept of this.concepts) {
            arrayify.push(this.#data, 'concept', concept.data);
        }

        return this;
    }

    /**
     * Validates given schema definition against this node. When schema is not
     * valid, throws SchemaError: 'Definition is not valid' with a reason.
     * 
     * @param {Object} schemaDefinition Schema definition to validate
     */
    validate(schemaDefinition) {
        if (this.hasOnlyVariableLeafNode()) {
            const dimensions = arrayify.dimensions(schemaDefinition);
            if (dimensions > this.variable.dimensions) {
                throw error.Schema_definition_is_not_valid__REASON(
                    because => because.VARIABLE_expects_at_most_EXPECTED_dimensional_array__but_got_ACTUAL(
                        this.variable.name, this.variable.dimensions, dimensions
                    )
                );
            }

            arrayify.each(schemaDefinition, item => this.variable.type.validate(item));

            return;
        }

        if (this.hasOnlyLiteralLeafNode()) {
            const literal = this.literals[0];

            if (schemaDefinition !== literal.name) {
                throw error.Schema_definition_is_not_valid__REASON(
                    because => because.Expected_LITERAL__but_got_VALUE(literal.name, schemaDefinition)
                );
            }

            return;
        }

        if (this.hasOnlyVariableNode()) {
            const dimensions = arrayify.dimensions(schemaDefinition);
            if (this.variable.dimensions < dimensions) {
                throw error.Schema_definition_is_not_valid__REASON(
                    because => because.VARIABLE_expects_at_most_EXPECTED_dimensional_array__but_got_ACTUAL(
                        this.name, this.variable.dimensions, dimensions
                    )
                );
            }

            arrayify.each(schemaDefinition, item => this.variable.validate(item));

            return;
        }

        if (Array.isArray(schemaDefinition)) {
            throw error.Schema_definition_is_not_valid__REASON(
                because => because.VARIABLE_is_not_an_array(this.name)
            );
        }

        const schemaKeys = SchemaKey.parseKeys(schemaDefinition, this);

        for (const literal of this.literals) {
            if (schemaKeys[literal.name]) {
                literal.validate(schemaDefinition[literal.name]);

                delete schemaKeys[literal.name];
            } else if (literal.quantifier.min > 0) {
                throw error.Schema_definition_is_not_valid__REASON(
                    because => because.LITERAL_is_missing(literal.name)
                );
            }
        }

        const quantities = {};
        const errors = {};

        for (const concept of this.concepts) {
            quantities[concept.name] = 0;

            for (const key in schemaKeys) {
                /** @type {import('./schema-key').SchemaKeyObject} */
                const schemaKey = schemaKeys[key];

                if (!schemaKey.mightBelongTo(concept)) {
                    continue;
                }

                try {
                    if (concept.type) {
                        concept.type.validate(schemaKey.name);
                    }

                    concept.validate(schemaDefinition[key]);

                    quantities[concept.name]++;
                    delete schemaKeys[key];
                    if (Object.prototype.hasOwnProperty.call(errors, key)) {
                        delete errors[key];
                    }
                } catch (e) {
                    if (e.name != error.Names.SCHEMA_ERROR) {
                        throw e;
                    }

                    arrayify.push(errors, key, e);
                }
            }
        }

        const remainingKeys = Object.keys(schemaKeys);
        if (remainingKeys.length > 0) {
            const remainingKey = remainingKeys[0];

            if (Object.prototype.hasOwnProperty.call(errors, remainingKey)) {
                throw arrayify.pull(errors, remainingKey)[0];
            } else {
                throw error.Schema_definition_is_not_valid__REASON(
                    because => because.TOKEN_is_not_expected(remainingKey)
                );
            }
        }

        for (const concept of this.concepts) {
            concept.#expression.validate(quantities[concept.name]);
        }
    }

    /**
     * @returns {ConceptsShadow}
     * 
     * @private
     */
    _asReference() {
        this.#referring = true;

        return this;
    }

    /**
     * @param {String} name
     * 
     * @returns {import('./concepts').VariablesData}
     * 
     * @private
     */
    _variables(
        name = required('name'),
        _result = {},
        _trace = new Set()
    ) {
        if (_trace.has(this)) {
            return _result;
        }

        _trace.add(this);

        if (this.hasOnlyVariableLeafNode()) {
            if (Object.prototype.hasOwnProperty.call(_result, this.#variable.name)) {
                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.CONCEPT_cannot_declare_VARIABLE_more_than_once(
                        name, this.#variable.name
                    )
                );
            }

            _result[this.#variable.name] = { name: this.#variable.name };
        } else {
            for (const literal of this.literals) {
                literal._variables(name, _result, _trace);
            }
        }

        return _result;
    }
}

module.exports = ConceptsShadow;

const Expression = require('./expression');
const SchemaKey = require('./schema-key');
const { SpecialCharacters: SC, Trace, error, arrayify, required } = require('./util');
