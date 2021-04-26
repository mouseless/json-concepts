class ConceptsShadow {
    /**
     * Quantifier represents the definition of allowed number of instances for
     * a token.
     * 
     * @typedef {Object} QuantifierData
     * 
     * @property {Number} min Minimum number of tokens to be allowed
     * @property {Number} max Maximum number of tokens to be allowed
     */
    /**
     * Variables are stored in an object instead of an array to provide quick
     * access via variable name.
     * 
     * @typedef {Object} VariablesData
     */

    /* const */ #expression;
    /* const */ #parent;
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
     */
    constructor(expression, parent) {
        this.#expression = expression;
        this.#parent = parent;

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
     * @returns {QuantifierData}
     */
    get quantifier() { return this.#expression != null ? this.#expression.quantifier : null; }
    /**
     * Checks if this node allows more than one instance.
     * 
     * @returns {Boolean} `true` if it is, `false` otherwise
     */
    get allowsMultiple() { return this.#expression != null && this.#expression.allowsMultiple; }
    /**
     * Variable type of this node. Available only when this node is a leaf node.
     */
    get type() { return this.#expression != null ? this.#expression.type : null; }
    /**
     * Parent of this node. `undefined` for root node.
     */
    get parent() { return this.#parent; }
    /**
     * Variable node under this node.
     * 
     * @returns {ConceptsShadow>}
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
     * @returns {VariablesData} Variables as key value pairs
     */
    getAllVariables() { return this._variables({}); }
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
     * 
     * @return {ConceptsShadow} Itself after build
     */
    build(definition) {
        if (typeof definition === 'string') {
            const expression = Expression.parseValue(definition);
            
            const leaf = new ConceptsShadow(expression, this).build();
            if (leaf.isVariable) {
                this.#variable = leaf;
            } else if (leaf.isLiteral) {
                this.#literals[leaf.name] = leaf;
            }
        } else if (typeof definition === 'object') {
            for (const key in definition) {
                const expression = Expression.parseKey(key);

                const node = new ConceptsShadow(expression, this).build(definition[key]);
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

        if (this.type != null) {
            this.#data.type = this.type;
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
            // todo variable validation

            return;
        }

        if (this.hasOnlyLiteralLeafNode()) {
            const literal = this.literals[0];

            if (schemaDefinition !== literal.name) {
                throw error.Schema_definition_is_not_valid__because__REASON(
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
                throw error.Schema_definition_is_not_valid__because__REASON(
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
                throw error.Schema_definition_is_not_valid__because__REASON(
                    because => because.TOKEN_is_not_expected(remainingKey)
                );
            }
        }

        for (const concept of this.concepts) {
            concept.#expression.validate(quantities[concept.name]);
        }
    }

    /**
     * @param {Object} result 
     * 
     * @returns {Object}
     */
    _variables(result = required('result')) {
        if (this.hasOnlyVariableLeafNode()) {
            result[this.#variable.name] = { name: this.#variable.name };
        } else {
            for (const literal of this.literals) {
                literal._variables(result);
            }
        }

        return result;
    }
}

module.exports = ConceptsShadow;

const Expression = require('./expression');
const { SpecialCharacters: SC, error, arrayify, required } = require('./util');
