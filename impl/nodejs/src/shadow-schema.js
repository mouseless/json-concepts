class ShadowSchema {
    static build(shadow, schema, concept) {
        shadow = shadow || {};

        if (concept.hasVariable()) {
            for (const variable of concept.variables) {
                arrayify.pushOrSet(shadow, variable.name, schema);
            }
            return;
        }

        for (const key in schema) {
            if (concept.hasLiteral(key)) {
                ShadowSchema.build(shadow, schema[key], concept.getLiteral(key));
            } else {
                for (const childConcept of concept.concepts) {
                    const childShadow = { [sc.SELF]: key };
                    ShadowSchema.build(childShadow, schema[key], childConcept);

                    arrayify.pushOrSet(shadow, childConcept.name, childShadow);
                }
            }
        }

        return shadow;
    }

    /* const */ #data;

    constructor(data) {
        this.#data = data;
    }

    get data() { return this.#data; }
}

module.exports = {
    ShadowSchema
};

const { sc, arrayify } = require('./util');