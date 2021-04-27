class ConceptsShadow {
    /* const */ #expression;
    /* const */ #parent;
    /* const */ #dimensions;
    /* const */ #variable;
    /* const */ #literals;
    /* const */ #concepts;
    /* const */ #data;

    /**
     * ConceptsShadow is a traversable tree version of a concepts definition.
     * It also represents any node in that tree.
     * 
     * This constructor only initializes a shadow instance. It should be built
     * after construction.
     * 
     * @param {Expression} expression Expression of this node. It should be
     * `undefined` for root node.
     * @param {ConceptsShadow} parent Parent of this node. It should be
     * `undefined` for root node.
     * @param {Number} dimensions (Default: 0) Allowed number of dimensions for
     * this node.
     */
    constructor(expression, parent, dimensions = 0) {
        this.#expression = expression;
        this.#parent = parent;
        this.#dimensions = dimensions;

        this.#variable = null;
        this.#literals = {};
        this.#concepts = {};
        this.#data = {};
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
     * Parent of this node. `undefined` for root node.
     * 
     * @returns {ConceptsShadow}
     */
    get parent() { return this.#parent; }
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
    get data() { return this.#data; }

    /**
     * Returns default value for this concept. This is used in schema shadow
     * when concept does not exist in a schema definition.
     * 
     * @returns {Array|Object}
     */
    get defaultValue() {
        if (this.#expression.allowsMultiple) {
            return [];
        }

        return null;
    }

    /**
     * Makes a deep search and returns all variables in the tree.
     * 
     * @returns {import('./concepts').VariablesData} Variables as key value
     * pairs.
     */
    getAllVariables() { return this._variables(this.name, {}); }
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
    hasOnlyVariableLeafNode() {
        return this.variable != null &&
            this.variable.isLeafNode() &&
            this.literals.length == 0 &&
            this.concepts.length == 0;
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
    build(definition, types) {
        const dimensions = arrayify.dimensions(definition);
        while (Array.isArray(definition)) {
            if (definition.length != 1) {
                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.KEY_is_only_allowed_an_array_with_one_item(this.name)
                );
            }

            definition = definition[0];
        }

        if (typeof definition === 'string') {
            const expression = Expression.parseValue(definition, types);

            const leaf = new ConceptsShadow(expression, this, dimensions).build();
            if (leaf.isVariable) {
                this.#variable = leaf;
            } else if (leaf.isLiteral) {
                this.#literals[leaf.name] = leaf;
            }
        } else if (typeof definition === 'object') {
            for (const key in definition) {
                const expression = Expression.parseKey(key, types);

                const node = new ConceptsShadow(expression, this).build(definition[key], types);
                if (node.isVariable) {
                    this.#concepts[node.name] = node;
                } else if (node.isLiteral) {
                    this.#literals[node.name] = node;
                }
            }
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

        if (this.type != null) {
            this.#data.type = this.type.name;
        }

        if (this.variable != null) {
            this.#data.variable = this.#variable.#data;
        }

        for (const literal of this.literals) {
            arrayify.push(this.#data, 'literal', literal.#data);
        }

        for (const concept of this.concepts) {
            arrayify.push(this.#data, 'concept', concept.#data);
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

            if (this.variable.type !== undefined) {
                this.variable.type.validate(schemaDefinition);
            }

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

        const schemaKeys = {};
        if (schemaDefinition != null && typeof schemaDefinition === 'object') {
            Object.keys(schemaDefinition).forEach(key => schemaKeys[key] = true);
        }

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

            for (const schemaKey of Object.keys(schemaKeys)) {
                try {
                    if (concept.type) {
                        concept.type.validate(schemaKey);
                    }

                    concept.validate(schemaDefinition[schemaKey]);

                    quantities[concept.name]++;
                    delete schemaKeys[schemaKey];
                    if (errors.hasOwnProperty(schemaKey)) {
                        delete errors[schemaKey];
                    }
                } catch (e) {
                    if (e.name != error.Names.SCHEMA_ERROR) {
                        throw e;
                    }

                    arrayify.push(errors, schemaKey, e);
                }
            }
        }

        const remainingKeys = Object.keys(schemaKeys);
        if (remainingKeys.length > 0) {
            const remainingKey = remainingKeys[0];

            if (errors.hasOwnProperty(remainingKey)) {
                throw arrayify.get(errors, remainingKey)[0];
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
     * @param {String} name
     * @param {import('./concepts').VariablesData} result
     * 
     * @returns {import('./concepts').VariablesData}
     */
    _variables(
        name = required('name'),
        result = required('result')
    ) {
        if (this.hasOnlyVariableLeafNode()) {
            if (result.hasOwnProperty(this.#variable.name)) {
                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.CONCEPT_cannot_have_VARIABLE_more_than_once(
                        name, this.#variable.name
                    )
                )
            }

            result[this.#variable.name] = { name: this.#variable.name };
        } else {
            for (const literal of this.literals) {
                literal._variables(name, result);
            }
        }

        return result;
    }
}

module.exports = ConceptsShadow;

const Expression = require('./expression');
const { SpecialCharacters: SC, error, arrayify, required } = require('./util');
