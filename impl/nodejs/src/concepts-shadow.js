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

    /* const */ #type;
    /* const */ #name;
    /* const */ #quantifier;
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
     * @param {String} expression Key expression of this node. It should be
     * `undefined` for root node.
     */
    constructor(expression, parent) {
        if (expression !== undefined) {
            const { type, name, quantifier } = keyExpression.parse(expression);

            this.#type = type;
            this.#name = name;
            this.#quantifier = quantifier;
        }

        this.#parent = parent;
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
     * Quantifier definition of this node. Result is guaranteed to have min and
     * max values.
     * 
     * @returns {QuantifierData}
     */
    get quantifier() { return this.#quantifier; }
    /**
     * Parent of this node. `undefined` for root node.
     */
    get parent() { return this.#parent; }
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

    get defaultValue() {
        if (this.quantifier.max > 1) {
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
            const key = definition;

            const leaf = new ConceptsShadow(key, this).build();

            if (leaf.#type == keyExpression.Types.VARIABLE) {
                this.#variable = leaf;
            } else if (leaf.#type == keyExpression.Types.LITERAL) {
                this.#literals[leaf.name] = leaf;
            }
        } else if (typeof definition === 'object') {
            for (const key in definition) {
                const node = new ConceptsShadow(key, this).build(definition[key]);

                if (node.#type == keyExpression.Types.VARIABLE) {
                    this.#concepts[node.name] = node;
                } else if (node.#type == keyExpression.Types.LITERAL) {
                    this.#literals[node.name] = node;
                }
            }
        }

        if (this.#name != null) {
            this.#data[SC.SELF] = this.#name;
        }

        if (this.#quantifier != null) {
            if (this.#quantifier.data != null) {
                this.#data.quantifier = this.#quantifier.data;
            }
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
            if (this.#type == keyExpression.Types.LITERAL) {
                if (this.quantifier.max > 1) {
                    if (!Array.isArray(schemaDefinition)) {
                        if (schemaDefinition === null) {
                            throw error.Definition_is_not_valid__because__REASON(
                                because => because.LITERAL_expects_an_array_for_VARIABLE__but_got_null(
                                    this.name, this.variable.name
                                )
                            )
                        } else {
                            throw error.Definition_is_not_valid__because__REASON(
                                because => because.LITERAL_expects_an_array_for_VARIABLE__but_got_an_instance_of_TYPE(
                                    this.name, this.variable.name, typeof schemaDefinition
                                )
                            );
                        }
                    }

                    if (schemaDefinition.length < this.quantifier.min) {
                        throw error.Definition_is_not_valid__because__REASON(
                            because => because.LITERAL_requires_VARIABLE_array_to_have_at_least_MIN_item_s___but_got_COUNT(
                                this.name, this.variable.name, this.quantifier.min, schemaDefinition.length
                            )
                        )
                    } else if (schemaDefinition.length > this.quantifier.max) {
                        throw error.Definition_is_not_valid__because__REASON(
                            because => because.LITERAL_requires_VARIABLE_array_to_have_at_most_MAX_item_s___but_got_COUNT(
                                this.name, this.variable.name, this.quantifier.max, schemaDefinition.length
                            )
                        );
                    }
                }
            }

            return;
        }

        if (this.hasOnlyLiteralLeafNode()) {
            const literal = this.literals[0];

            if (schemaDefinition !== literal.name) {
                throw error.Definition_is_not_valid__because__REASON(
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
                throw error.Definition_is_not_valid__because__REASON(
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
                throw error.Definition_is_not_valid__because__REASON(
                    because => because.TOKEN_is_not_expected(remainingKey)
                );
            }
        }

        for (const concept of this.concepts) {
            if (quantities[concept.name] < concept.quantifier.min) {
                if (concept.quantifier == keyExpression.Quantifiers.DEFAULT) {
                    throw error.Definition_is_not_valid__because__REASON(
                        because => because.CONCEPT_is_missing(concept.name)
                    );
                } else {
                    throw error.Definition_is_not_valid__because__REASON(
                        because => because.Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT(
                            concept.name, concept.quantifier.min, quantities[concept.name]
                        )
                    );
                }
            } else if (quantities[concept.name] > concept.quantifier.max) {
                throw error.Definition_is_not_valid__because__REASON(
                    because => because.Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT(
                        concept.name, concept.quantifier.max, quantities[concept.name]
                    )
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

module.exports = ConceptsShadow;

const { SpecialCharacters: SC, error, arrayify, keyExpression, required } = require('./util');
