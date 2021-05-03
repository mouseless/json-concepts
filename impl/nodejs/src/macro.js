class Macro {
    /**
     * Processes macros within given definition object and returns processed object.
     * 
     * @param {Object} definition (Required) Definition to be processed
     * 
     * @returns {Object} Processed object
     */
    static process(definition = required('definition')) {
        return new Macro(definition).process();
    }

    /* const */ #macros;
    /* const */ #definition;

    /**
     * Macro represents the processing of macros of a definition object. After
     * this process ended, this class manipulates given definition object.
     * 
     * This constructor builds macros from given definition and makes definition
     * object ready to be processed.
     * 
     * @param {Object} definition Definition object including macros
     */
    constructor(definition) {
        this.#definition = definition;

        this.#macros = {};
        for (const key in this.#definition) {
            if (!_expressionIsMacro(key)) { continue; }

            if (key.substring(SC.MACRO.length) == "") {
                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.Reference_EXPRESSION_must_have_a_name(this.#definition[key])
                );
            }

            this.#macros[key] = this.#definition[key];
            delete this.#definition[key];
        }
    }

    /**
     * Processes definition object of this macro instance.
     * 
     * @returns Processed object
     */
    process() {
        for (const key in this.#macros) {
            this.#macros[key] = this._process(this.#macros[key], key);
        }

        return this._process(this.#definition);
    }

    /**
     * @param {Object} definition 
     * 
     * @returns {Object} 
     */
    _process(definition) {
        if (typeof definition !== 'object') {
            return definition;
        }

        for (const key in definition) {
            if (key.startsWith(SC.MACRO)) {
                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.REFERENCE_should_be_defined_at_the_root(key)
                );
            }
        }

        for (const key in definition) {
            const value = definition[key];

            if (_expressionIsMacro(value)) {
                definition[key] = this._get(value);
            } else if (Array.isArray(value) && value.every(item => _expressionIsMacro(item))) {
                definition[key] = this._merge(value);
            } else if (Array.isArray(value) && value.some(item => _expressionIsMacro(item))) {
                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.All_items_in_ARRAY_should_be_a_reference(value)
                );
            } else {
                definition[key] = this._process(value);
            }
        }

        return definition;
    }

    /**
     * @param {String} reference 
     * 
     * @returns {Object}
     */
    _get(reference) {
        if (!this.#macros[reference]) {
            throw error.Concepts_definition_is_not_valid__REASON(
                because => because.REFERENCE_cannot_be_found(reference)
            );
        }

        return this.#macros[reference];
    }

    /**
     * @param {Array} array 
     * 
     * @returns {Object|String}
     */
    _merge(array) {
        const merged = {};

        for (const reference of array) {
            const value = this._get(reference);

            if (typeof value !== 'object') {
                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.Cannot_merge_a_non_object_reference__REFERENCE(reference)
                );
            }

            for (const key in value) {
                if (merged[key]) {
                    throw error.Concepts_definition_is_not_valid__REASON(
                        because => because.Cannot_merge_REFERENCES__conflict_occurs_on_KEY(array, key)
                    );
                }

                merged[key] = value[key];
            }
        }

        return merged;
    }
}

function _expressionIsMacro(expression) {
    return typeof expression === 'string' && expression.startsWith(SC.MACRO);
}

module.exports = Macro;

const { SpecialCharacters: SC, error, required } = require('./util');