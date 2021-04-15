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

    #name;
    #variables;
    #literals;
    #concepts;
    #literalMap;
    #shadow;

    constructor(name) {
        this.#name = name;
        this.#variables = [];
        this.#literals = [];
        this.#concepts = [];
    }

    get name() {
        return this.#name;
    }

    get shadow() {
        if(this.#shadow == null) {
            this.#shadow = {};

            if(this.#name != null) {
                this.#shadow[sc.SELF] = this.#name;
            }

            for(const variable of this.#variables) {
                arrayify.pushOrSet(this.#shadow, 'variable', variable.shadow);
            }

            for(const literal of this.#literals) {
                arrayify.pushOrSet(this.#shadow, 'literal', literal.shadow);
            }

            for(const concept of this.#concepts) {
                arrayify.pushOrSet(this.#shadow, 'concept', concept.shadow);
            }
        }

        return this.#shadow;
    }

    get variables() {
        return this.#variables;
    }

    get literals() {
        return this.#literals;
    }

    get concepts() {
        return this.#concepts;
    }

    pushVariable(key) {
        this.#variables.push(
            Concept.build(sc.from(sc.VARIABLE, key))
        );
    }

    pushLiteral(key, concepts) {
        this.#literals.push(
            Concept.build(key, concepts[key])
        );
    }

    pushConcept(key, concepts) {
        this.#concepts.push(
            Concept.build(sc.from(sc.VARIABLE, key), concepts[key])
        );
    }

    hasVariable() {
        return this.#variables.length > 0;
    }

    hasLiteral(name) {
        return this.getLiteral(name) != null;
    }

    getLiteral(name) {
        if (this.#literalMap == null) {
            this.#literalMap = {};
            for (const literal of this.#literals) {
                this.#literalMap[literal.name] = literal;
            }
        }

        return this.#literalMap[name];
    }
}

module.exports = {
    Concept
};

const { sc, arrayify } = require('./util');
