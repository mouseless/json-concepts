class Concept {
    static build(name, concepts) {
        const concept = new Concept(name);

        if (typeof concepts === 'string' && sc.is(sc.VARIABLE, concepts)) {
            concept.pushVariable(concepts);
        } else if (typeof concepts === 'object') {
            for (const key in concepts) {
                if (sc.is(sc.VARIABLE, key)) {
                    concept.pushConcept(key, concepts);
                } else {
                    concept.pushLiteral(key, concepts);
                }
            }
        }

        return concept;
    }

    static from(shadow) {
        return new Concept(undefined, shadow);
    }

    #name;
    #shadow;
    #variables;
    #literals;
    #concepts;
    #literalMap;

    constructor(name, shadow) {
        this.#name = name;
        this.#shadow = shadow || {};

        if (name != undefined) {
            this.#shadow[sc.SELF] = name;
        }
    }

    get name() {
        return this.#name;
    }

    get shadow() {
        return this.#shadow;
    }

    get variables() {
        if (this.#variables == null) {
            this.#variables = arrayify.get(this.#shadow, 'variable');
        }

        return this.#variables;
    }

    get literals() {
        if (this.#literals == null) {
            this.#literals = arrayify.get(this.#shadow, 'literal');
        }

        return this.#literals;
    }

    get concepts() {
        if (this.#concepts == null) {
            this.#concepts = arrayify.get(this.#shadow, 'concept');
        }

        return this.#concepts;
    }

    pushVariable(key) {
        const variable = {
            [sc.SELF]: sc.from(sc.VARIABLE, key)
        };

        arrayify.pushOrSet(this.#shadow, 'variable', variable);
    }

    pushLiteral(key, concepts) {
        const literal = Concept.build(key, concepts[key]);

        arrayify.pushOrSet(this.#shadow, 'literal', literal.#shadow);
    }

    pushConcept(key, concepts) {
        const concept = Concept.build(
            sc.from(sc.VARIABLE, key),
            concepts[key]
        );

        arrayify.pushOrSet(this.#shadow, 'concept', concept.#shadow);
    }

    hasVariable() {
        return this.variables.length > 0;
    }

    getLiteral(name) {
        if (this.#literalMap == null) {
            this.#literalMap = {};
            for (let i = 0; i < this.literals.length; i++) {
                const literal = this.literals[i];

                this.#literalMap[literal[sc.SELF]] = literal;
            }
        }

        return this.#literalMap[name];
    }

    hasLiteral(name) {
        return this.getLiteral(name) != null;
    }
}

module.exports = {
    Concept
};

const { sc, arrayify } = require('./util');
