class ConceptsShadow {
    /**
     * Quantifier represents the definition of allowed number of instances for
     * a token.
     * 
     * @typedef {Object} QuantifierData
     * 
     * @property {Number} min Minimum number of token to be allowed
     * @property {Number} max Maximum number of token to be allowed
     */
    /**
     * Variables are stored in an object instead of an array to provide quick
     * access via variable name.
     * 
     * @typedef {Object} VariablesData
     */

    /* const */ #type;
    /* const */ #name;
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
     * @param {String} expression Key expression of this node. It should be
     * `undefined` for root node.
     */
    constructor(expression) {
        if (expression === undefined) {
            this.#type = Types.ROOT;
            this.#name == null;
        } else if (SC.VARIABLE.matches(expression)) {
            this.#type = Types.VARIABLE;
            this.#name = SC.VARIABLE.undecorate(expression);
        } else {
            this.#type = Types.LITERAL;
            this.#name = expression;
        }

        this.#variable = null;
        this.#literals = {};
        this.#concepts = {};
        this.#data = {};
    }

    /**
     * Name of this node
     * 
     * @returns {String}
     */
    get name() { return this.#name; }
    /**
     * Quantifier definition of this node.
     * 
     * @returns {QuantifierData}
     */
    get quantifier() { return { min: 1, max: 1 }; }
    /**
     * Array of variable nodes under this node.
     * 
     * @returns {Array.<ConceptsShadow>}
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
     * Helper method to check if this node has a literal node with given name.
     * 
     * @param {String} name (Required) Literal name to check
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasLiteral(name = required('name')) { return this.#literals.hasOwnProperty(name); }
    /**
     * Helper method to get literal node with given name.
     * 
     * @param {String} name (Required) Literal name to get
     * 
     * @returns {ConceptsShadow} Literal node with given name under this node
     */
    getLiteral(name = required('name')) { return this.#literals[name]; }
    /**
     * Makes a deep search and returns all variables in the tree.
     * 
     * @returns {VariablesData} Variables as key value pairs
     */
    getAllVariables() { return this._variables({}); }

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
            const key = definition;

            const leaf = new ConceptsShadow(key).build();

            if (leaf.#type == Types.VARIABLE) {
                this.#variable = leaf;
            } else if (leaf.#type == Types.LITERAL) {
                this.#literals[leaf.name] = leaf;
            }
        } else if (typeof definition === 'object') {
            for (const key in definition) {
                const node = new ConceptsShadow(key).build(definition[key]);

                if (node.#type == Types.VARIABLE) {
                    this.#concepts[node.name] = node;
                } else if (node.#type == Types.LITERAL) {
                    this.#literals[node.name] = node;
                }
            }
        }

        if (this.#name != null) {
            this.#data[SC.SELF.value] = this.#name;
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
            // variable validation here

            return;
        }

        if (this.hasOnlyLiteralLeafNode()) {
            const literal = this.literals[0];

            if (schemaDefinition !== literal.name) {
                throw error.Definition_is_not_valid__because__REASON(
                    because => because.Expected_LITERAL_got_VALUE(literal.name, schemaDefinition)
                );
            }

            return;
        }

        const schemaKeys = {};
        if (schemaDefinition != null && typeof schemaDefinition === 'object') {
            Object.keys(schemaDefinition).forEach(key => schemaKeys[key] = true);
        }

        for (const literal of this.literals) {
            if (!schemaKeys[literal.name]) {
                throw error.Definition_is_not_valid__because__REASON(
                    because => because.LITERAL_is_missing(literal.name)
                );
            }

            literal.validate(schemaDefinition[literal.name]);

            delete schemaKeys[literal.name];
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
                throw error.Definition_is_not_valid__because__REASON(
                    because => because.TOKEN_is_not_expected(remainingKey)
                );
            }
        }

        for (const concept of this.concepts) {
            if (quantities[concept.name] < concept.quantifier.min) {
                throw error.Definition_is_not_valid__because__REASON(
                    because => because.CONCEPT_is_missing(concept.name)
                );
            }
        }
    }

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

const Types = {
    ROOT: 1,
    LITERAL: 2,
    VARIABLE: 3
}

module.exports = ConceptsShadow;

const { SpecialCharacters: SC, error, arrayify, required } = require('./util');
