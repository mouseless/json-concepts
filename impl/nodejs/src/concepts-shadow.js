class ConceptsShadow {
    /**
     * Quantifier represents the definition of allowed number of instances for
     * a token.
     * 
     * @typedef {Object} Quantifier
     * 
     * @property {Number} min Minimum number of token to be allowed
     * @property {Number} max Maximum number of token to be allowed
     */

    /* const */ #name;
    /* const */ #variables;
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
     * @param {String} name Name of this node. It should be `undefined` for
     * root node.
     */
    constructor(name) {
        this.#name = name;

        this.#variables = {};
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
     * @returns {Quantifier}
     */
    get quantifier() { return { min: 1, max: 1 }; }
    /**
     * Array of variable nodes under this node.
     * 
     * @returns {Array.<ConceptsShadow>}
     */
    get variables() { return Object.values(this.#variables); }
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
     * Helper method to check if this node has any variable nodes.
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasAnyVariables() { return this.variables.length > 0; }
    /**
     * Helper method to check if this node has any literal nodes.
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasAnyLiterals() { return this.literals.length > 0; }
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
     * Helper method to check if this node has any concept nodes.
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasAnyConcepts() { return this.concepts.length > 0; }

    /**
     * Helper method to check if this node is a leaf node.
     * 
     * @returns {boolean} `true` if it is, `false` otherwise
     */
    hasNothingButName() {
        return this.#name != null &&
            !this.hasAnyVariables() &&
            !this.hasAnyLiterals() &&
            !this.hasAnyConcepts();
    }

    /**
     * Recursively builds this node using given concepts definition. When no
     * definition is given, it means this node is a leaf node.
     * 
     * @param {Object} definition Concepts definition
     */
    build(definition) {
        if (definition != null) {
            this._build(definition);
        }

        if (this.#name != null) {
            this.#data[SC.SELF.value] = this.#name;
        }

        for (const variable of this.variables) {
            arrayify.push(this.#data, 'variable', variable.#data);
        }

        for (const literal of this.literals) {
            arrayify.push(this.#data, 'literal', literal.#data);
        }

        for (const concept of this.concepts) {
            arrayify.push(this.#data, 'concept', concept.#data);
        }
    }

    _build(definition) {
        if (typeof definition === 'string') {
            if (SC.VARIABLE.matches(definition)) {
                this._pushVariable(definition);
            } else {
                this._pushLiteral(definition);
            }
        } else if (typeof definition === 'object') {
            for (const key in definition) {
                if (SC.VARIABLE.matches(key)) {
                    this._pushConcept(key, definition);
                } else {
                    this._pushLiteral(key, definition);
                }
            }
        }
    }

    _pushVariable(key) {
        const variable = new ConceptsShadow(SC.VARIABLE.undecorate(key));
        variable.build();

        this.#variables[variable.name] = variable;
    }

    _pushLiteral(key, parentDefinition) {
        const literal = new ConceptsShadow(key);
        literal.build(parentDefinition != null ? parentDefinition[key] : null);

        this.#literals[literal.name] = literal;
    }

    _pushConcept(key, parentDefinition) {
        const concept = new ConceptsShadow(SC.VARIABLE.undecorate(key));
        concept.build(parentDefinition[key]);

        this.#concepts[concept.name] = concept;
    }
}

module.exports = ConceptsShadow;

const { SpecialCharacters: SC, arrayify, required } = require('./util');
