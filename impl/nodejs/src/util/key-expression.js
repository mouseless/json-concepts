const SC = require('./special-characters');
const { required } = require('./validation');

/**
 * Quantifier represents the definition of allowed number of instances for
 * a token.
 * 
 * @typedef {Object} QuantifierData
 * 
 * @property {Number} min Minimum number of tokens to be allowed
 * @property {Number} max Maximum number of tokens to be allowed
 */
/**
 * Carries type, name and quantifier information as a result of parsing.
 * 
 * @typedef {Object} KeyExpressionData
 * @property {Number} type Type of key expression
 * @property {String} name Name of key expression
 * @property {QuantifierData} quantifier Quantifier of key expression
 */

/**
 * Possible types of key expressions.
 * 
 * @enum {Number}
 */
const Types = {
    VARIABLE: 1,
    LITERAL: 2
}

const _scHash = {
    [SC.VARIABLE]: SC.VARIABLE,
    [SC.ZERO_OR_ONE]: SC.ZERO_OR_ONE,
    [SC.ZERO_OR_MORE]: SC.ZERO_OR_MORE,
    [SC.ONE_OR_MORE]: SC.ONE_OR_MORE
};

/**
 * Available quantifiers. Use quantifier special characters to get their
 * quantifier data.
 * 
 * @see {SpecialCharacters}
 * @enum {QuantifierData}
 */
const Quantifiers = {
    DEFAULT: { min: 1, max: 1 },
    [SC.ZERO_OR_ONE]: { min: 0, max: 1 },
    [SC.ONE_OR_MORE]: { min: 1, max: Number.POSITIVE_INFINITY },
    [SC.ZERO_OR_MORE]: { min: 0, max: Number.POSITIVE_INFINITY }
};

/**
 * Parses key expression. Quantifier is null when it does not exist in the
 * expression.
 * 
 * @param {String} expression (Required) Key expression to parse
 * 
 * @returns {KeyExpressionData} Parsed expression data
 */
function parse(expression = required('expression')) {
    const tokens = [];
    let current = "";
    for (const c of expression) {
        if (_scHash[c]) {
            if (current.length > 0) {
                tokens.push(current);
                current = "";
            }

            tokens.push(_scHash[c]);
        } else {
            current += c;
        }
    }

    if (current.length > 0) {
        tokens.push(current);
    }

    const result = {};

    let token = tokens.shift();
    if (token == SC.VARIABLE) {
        result.type = Types.VARIABLE;
        result.name = tokens.shift();
    } else {
        result.type = Types.LITERAL;
        result.name = token;
    }

    token = tokens.shift();
    if (token !== undefined) {
        result.quantifier = Quantifiers[token];
    }

    return result;
}

module.exports = {
    Types,
    Quantifiers,
    parse
};
