/* exported */ class Schema {
    /**
     * Loads schema from given path.
     * 
     * @async
     * @param {String} path (Required) File path or URL to load schema from
     * @param {String|Object|Concepts} concepts Concepts of schema to be
     * loaded. This is not required when loaded schema contains concepts
     * meta-data. Otherwise it is required.
     * 
     * @returns {Promise<Schema>} Schema at given path
     */
    static async load(
        path = required('path'),
        concepts = null
    ) {
        const object = await loadJSON(path);

        concepts = concepts ||
            metaData.read(object, 'concepts', /* burnAfterReading */ true);

        if (concepts === null) {
            throw error.Concepts_required_to_load_SCHEMA(path);
        }

        if (!(concepts instanceof Concepts)) {
            if(typeof concepts === 'object') {
                concepts = new Concepts(concepts);
            } else {
                concepts = await Concepts.load(concepts);
            }
        }

        try {
            return new Schema(object, concepts);
        } catch (e) {
            if (e.name === error.Names.SCHEMA_ERROR) {
                throw error.SCHEMA_is_not_valid(path);
            }

            throw e;
        }
    }

    /* const */ #object;
    /* const */ #concepts;
    /* const */ #shadow;

    /**
     * Schema represents a meta-data about anything. For now schemas will not
     * a data validation capability. This is because its focus is more on
     * schema transformation and code generation than pure data.
     * 
     * This constructor validates given object against given concepts, and
     * builds schema from given object.
     * 
     * @param {Object} object (Required) Schema object
     * @param {Concepts} concepts (Required) Concepts of this schema
     */
    constructor(
        object = required('object'),
        concepts = required('concepts')
    ) {
        if (!concepts.validate(object)) {
            throw error.SCHEMA_is_not_valid(object);
        }

        this.#object = object;
        this.#concepts = concepts;

        this.#shadow = new SchemaShadow(this.#concepts._shadow);
        this.#shadow.build(this.#object);
    }

    /**
     * Data of this schema as an object. Any meta-data that was in a schema
     * file is removed during load operation. This will only have schema data.
     * 
     * @returns {Object}
     */
    get object() { return this.#object; }
    /**
     * Shadow data of this schema as an object.
     * 
     * @returns {Object}
     */
    get shadow() { return this.#shadow.data; }

    get _shadow() { return this.#shadow; }
}

module.exports = { Schema };

const { Concepts } = require('./concepts');
const { SchemaShadow } = require('./schema-shadow');
const { error, metaData, required, loadJSON } = require('./util');
