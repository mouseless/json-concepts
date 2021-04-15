class Concept {
    /* const */ #name;
    /* const */ #variables;
    /* const */ #literals;
    /* const */ #concepts;
    /* const */ #literalMap;

    /* let */ #shadow;

    constructor(name) {
        this.#name = name;

        this.#variables = [];
        this.#literals = [];
        this.#concepts = [];
        this.#literalMap = {};
    }

    get name() { return this.#name; }
    get variables() { return this.#variables; }
    get literals() { return this.#literals; }
    get concepts() { return this.#concepts; }

    get shadow() {
        if (this.#shadow == null) {
            this.#shadow = {};

            if (this.#name != null) {
                this.#shadow[sc.SELF] = this.#name;
            }

            for (const variable of this.#variables) {
                arrayify.pushOrSet(this.#shadow, 'variable', variable.shadow);
            }

            for (const literal of this.#literals) {
                arrayify.pushOrSet(this.#shadow, 'literal', literal.shadow);
            }

            for (const concept of this.#concepts) {
                arrayify.pushOrSet(this.#shadow, 'concept', concept.shadow);
            }
        }

        return this.#shadow;
    }

    build(concepts = required('concepts')) {
        if (typeof concepts === 'string' && sc.is(sc.VARIABLE, concepts)) {
            this.pushVariable(concepts);
        } else if (typeof concepts === 'object') {
            for (const key in concepts) {
                if (sc.is(sc.VARIABLE, key)) {
                    this.pushConcept(key, concepts);
                } else {
                    this.pushLiteral(key, concepts);
                }
            }
        }
    }

    pushVariable(key) {
        const variable = new Concept(sc.from(sc.VARIABLE, key));
        this.#variables.push(variable);
    }

    pushLiteral(key, concepts) {
        const literal = new Concept(key);
        literal.build(concepts[key]);
        this.#literals.push(literal);
        this.#literalMap[literal.name] = literal;
    }

    pushConcept(key, concepts) {
        const concept = new Concept(sc.from(sc.VARIABLE, key));
        concept.build(concepts[key]);
        this.#concepts.push(concept);
    }

    hasVariable() { return this.#variables.length > 0; }
    hasLiteral(name) { return this.#literalMap.hasOwnProperty(name); }
    getLiteral(name) { return this.#literalMap[name]; }
}

module.exports = {
    Concept
};

const { sc, arrayify, required } = require('./util');
