/**
 * Contains all available special characters.
 * 
 * @enum {String}
 */
const SpecialCharacters = {
    /** `$variable` */
    VARIABLE: "$",
    /** `#preprocessor` */
    PREPROCESSOR: "#",
    /** `:type` */
    TYPE: ":",
    /** `@metaData` */
    META_DATA: "@",
    /** `zeroOrOne?` */
    ZERO_OR_ONE: "?",
    /** `zeroOrMore*` */
    ZERO_OR_MORE: "*",
    /** `oneOrMore+` */
    ONE_OR_MORE: "+",
    /** `/path/to/something` */
    PATH: "/",
    /** `../parent` */
    PARENT: "..",
    /** `/*` */
    ANY: "*",
    /** `/**` */
    ANY_CHILD: "**",
    /** `_` */
    SELF: "_",
    /** `{` */
    BEGIN_QUANTIFIER: "{",
    /** `}` */
    END_QUANTIFIER: "}",
    /** `,` */
    QUANTIFIER_SEPARATOR: ","
}

module.exports = SpecialCharacters;
