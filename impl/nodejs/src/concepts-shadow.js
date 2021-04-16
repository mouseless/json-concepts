class ConceptsShadow {
    /* const */ #name;
    /* const */ #variables;
    /* const */ #literals;
    /* const */ #literalMap;
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

        this.#variables = [];
        this.#literals = [];
        this.#literalMap = {};
        this.#concepts = [];
        this.#data = {};
    }

    /**
     * Name of this node
     * 
     * @returns {String}
     */
    get name() { return this.#name; }
    /**
     * Array of variable nodes under this node.
     * 
     * @returns {Array.<ConceptsShadow>}
     */
    get variables() { return this.#variables; }
    /**
     * Array of literal nodes under this node.
     * 
     * @returns {Array.<ConceptsShadow>}
     */
    get literals() { return this.#literals; }
    /**
     * Array of concept nodes under this node.
     * 
     * @returns {Array.<ConceptsShadow>}
     */
    get concepts() { return this.#concepts; }
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
    hasAnyVariables() { return this.#variables.length > 0; }
    /**
     * Helper method to check if this node has any literal nodes.
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasAnyLiterals() { return this.#literals.length > 0; }
    /**
     * Helper method to check if this node has a literal node with given name.
     * 
     * @param {String} name (Required) Literal name to check
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasLiteral(name = required('name')) { return this.#literalMap.hasOwnProperty(name); }
    /**
     * Helper method to get literal node with given name.
     * 
     * @param {String} name (Required) Literal name to get
     * 
     * @returns {ConceptsShadow} Literal node with given name under this node
     */
    getLiteral(name = required('name')) { return this.#literalMap[name]; }
    /**
     * Helper method to check if this node has any concept nodes.
     * 
     * @returns {boolean} `true` if it has, `false` otherwise
     */
    hasAnyConcepts() { return this.#concepts.length > 0; }

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
     * Recursively builds this node using given concepts object. When no
     * object is given, it means this node is a leaf node.
     * 
     * @param {Object} concepts Concepts object
     */
    build(concepts) {
        if (concepts != null) {
            if (typeof concepts === 'string' && SC.VARIABLE.matches(concepts)) {
                this._pushVariable(concepts);
            } else if (typeof concepts === 'object') {
                for (const key in concepts) {
                    if (SC.VARIABLE.matches(key)) {
                        this._pushConcept(key, concepts);
                    } else {
                        this._pushLiteral(key, concepts);
                    }
                }
            }
        }

        if (this.#name != null) {
            this.#data[SC.SELF.value] = this.#name;
        }

        for (const variable of this.#variables) {
            arrayify.push(this.#data, 'variable', variable.#data);
        }

        for (const literal of this.#literals) {
            arrayify.push(this.#data, 'literal', literal.#data);
        }

        for (const concept of this.#concepts) {
            arrayify.push(this.#data, 'concept', concept.#data);
        }
    }

    _pushVariable(key) {
        const variable = new ConceptsShadow(SC.VARIABLE.undecorate(key));
        variable.build();

        this.#variables.push(variable);
    }

    _pushLiteral(key, concepts) {
        const literal = new ConceptsShadow(key);
        literal.build(concepts[key]);

        this.#literals.push(literal);
        this.#literalMap[literal.name] = literal;
    }

    _pushConcept(key, concepts) {
        const concept = new ConceptsShadow(SC.VARIABLE.undecorate(key));
        concept.build(concepts[key]);

        this.#concepts.push(concept);
    }
}

module.exports = {
    ConceptsShadow
};

const { SpecialCharacters: SC, arrayify, required } = require('./util');
