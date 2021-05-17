/**
 * Contains all available special characters.
 * 
 * @enum {String}
 */
const SpecialCharacters = {
    /** `$variable` */
    VARIABLE: "$",
    /** `#macro` */
    MACRO: "#",
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
    SELF: "name",
    /** `{` */
    BEGIN_QUANTIFIER: "{",
    /** `}` */
    END_QUANTIFIER: "}",
    /** `,` */
    QUANTIFIER_SEPARATOR: ",",
    /** `\` */
    ESCAPE: "\\",
    /** `&` */
    AND: "&",
    /** `|` */
    OR: "|"
}

module.exports = SpecialCharacters;
