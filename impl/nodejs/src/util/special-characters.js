class SpecialCharacter {
    #value;

    /**
     * SpecialCharacter represents a special character that is used by JSON
     * Concepts.
     * 
     * @param {String} value 
     */
    constructor(value) {
        this.#value = value;
    }

    /**
     * Value of this special character
     * 
     * @returns {String}
     */
    get value() { return this.#value; }

    /**
     * Validates given expression against this to check if it matches or not.
     * 
     * @param {String} expression (Required) Expression to check
     * 
     * @returns {boolean} `true` if it matches, `false` otherwise
     */
    matches(expression = required('expression')) {
        return expression.startsWith(this.#value);
    }

    /**
     * Decorates given key to conform to this special character.
     * 
     * @param {String} key (Required) Key to convert to an expression
     * 
     * @returns {String} A valid expression
     */
    decorate(key = required('key')) {
        return `${this.#value}${key}`;
    }

    /**
     * Undecorates given expression to a regular key.
     * 
     * @param {String} expression (Required) Expression to undecorate
     * 
     * @returns Undecorated version of given expression
     */
    undecorate(expression = required('expression')) {
        if (!this.matches(expression)) {
            return expression;
        }

        return expression.substring(this.#value.length);
    }
}

/**
 * Contains all available special characters.
 * 
 * @enum {SpecialCharacter}
 */
const SpecialCharacters = {
    /** `$variable` */
    VARIABLE: new SpecialCharacter("$"),
    /** `#preprocessor` */
    PREPROCESSOR: new SpecialCharacter("#"),
    /** `:type` */
    TYPE: new SpecialCharacter(":"),
    /** `@metaData` */
    META_DATA: new SpecialCharacter("@"),
    /** `zeroOrOne?` */
    ZERO_OR_ONE: new SpecialCharacter("?"),
    /** `oneOrMore+` */
    ONE_OR_MORE: new SpecialCharacter("+"),
    /** `zeroOrMore*` */
    ZERO_OR_MORE: new SpecialCharacter("*"),
    /** `/path/to/something` */
    PATH: new SpecialCharacter("/"),
    /** `../parent` */
    PARENT: new SpecialCharacter(".."),
    /** `/*` */
    ANY: new SpecialCharacter("*"),
    /** `/**` */
    ANY_CHILD: new SpecialCharacter("**"),
    /** `_` */
    SELF: new SpecialCharacter("_")
}

module.exports = {
    SpecialCharacters
};

const { required } = require("./validation");