/* exported */ class Schema {
    /**
     * @param {String|Object} pathOrObject 
     * @param {String|Object|Concepts} concepts
     * 
     * @returns {Schema}
     */
    static async load(
        pathOrObject = required('pathOrObject'),
        concepts = null
    ) {
        const object = await loadJSON(pathOrObject);

        concepts = concepts || metaData.read(object, 'concepts', true);

        if (concepts === null) {
            throw error.Concepts_required_to_load_SCHEMA(pathOrObject);
        }

        if (!(concepts instanceof Concepts)) {
            concepts = await Concepts.load(concepts);
        }

        try {
            return await concepts.load(object);
        } catch (e) {
            if (e.name === error.Names.SCHEMA_ERROR) {
                throw error.SCHEMA_is_not_valid(pathOrObject);
            }

            throw e;
        }
    }

    /* const */ #object;
    /* const */ #concepts;
    /* const */ #shadow;

    constructor(
        object = required('object'),
        concepts = required('concepts')
    ) {
        this.#object = object;
        this.#concepts = concepts;

        this.#shadow = new ShadowSchema(ShadowSchema.build(undefined, this.#object, this.#concepts._shadow));
    }

    get object() { return this.#object; }
    get shadow() { return this.#shadow.data; }
    
    get _shadow() { return this.#shadow; }
}

module.exports = { Schema };

const { Concepts } = require('./concepts');
const { ShadowSchema } = require('./shadow-schema');
const { error, metaData, required, loadJSON } = require('./util');
