/** @public */ class Schema {
    /**
     * Loads schema from given path.
     * 
     * @async
     * @param {String} path (Required) Path or URL to load schema from
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
        const definition = await loadJSONData(path);

        let relativeTo;
        if (!concepts) {
            concepts = metaData.read(definition, 'concepts', /* burnAfterReading */ true);
            relativeTo = path;
        } else {
            metaData.burn(definition, 'concepts');
        }

        if (concepts === null) {
            throw error.Concepts_required_to_load_SCHEMA(path);
        }

        if (!(concepts instanceof Concepts)) {
            if (typeof concepts === 'object') {
                concepts = new Concepts(concepts);
            } else {
                concepts = await Concepts.load(concepts, relativeTo);
            }
        }

        try {
            return new Schema(definition, concepts);
        } catch (e) {
            if (e.name === error.Names.SCHEMA_ERROR) {
                throw error.SCHEMA_is_not_valid__Error_is__ERROR(path, e.message);
            }

            throw e;
        }
    }

    /* const */ #definition;
    /* const */ #concepts;
    /* const */ #shadow;

    /**
     * Schema represents a meta-data about anything. For now schemas will not
     * have a data validation capability. This is because its focus is more on
     * schema transformation and code generation than data validation.
     * 
     * This constructor validates given definition against given concepts, and
     * builds schema from given definition.
     * 
     * @param {Object} definition (Required) Schema definition
     * @param {Concepts} concepts (Required) Concepts of this schema
     */
    constructor(
        definition = required('definition'),
        concepts = required('concepts')
    ) {
        concepts.validate(definition);

        this.#definition = definition;
        this.#concepts = concepts;

        this.#shadow = new SchemaShadow(this.#concepts._shadow);
        this.#shadow.build(this.#definition);
    }

    /**
     * Definition of this schema as an object. Any meta-data that was in a
     * schema file is removed during load operation. This will only have
     * schema definition itself.
     * 
     * @returns {Object}
     */
    get definition() { return this.#definition; }
    /**
     * Shadow definition of this schema as an object.
     * 
     * @returns {Object}
     */
    get shadow() { return this.#shadow.data; }

    /**
     * @private
     */
    get _shadow() { return this.#shadow; }
}

module.exports = Schema;

const Concepts = require('./concepts');
const SchemaShadow = require('./schema-shadow');
const { error, metaData, required, loadJSONData } = require('./util');
