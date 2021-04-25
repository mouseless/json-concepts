const SC = require('./special-characters');
const error = require('./error');
const { required } = require('./validation');

/**
 * Quantifier represents the definition of allowed number of instances for
 * a token.
 * 
 * @typedef {Object} QuantifierData
 * 
 * @property {Number} min Minimum number of tokens to be allowed
 * @property {Number} max Maximum number of tokens to be allowed
 * @property {String} expression Quantifier expression
 * @property {{min:Number?, max:Number?}?} data Data representation of
 * quantifier data.
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
    [SC.ONE_OR_MORE]: SC.ONE_OR_MORE,
    [SC.BEGIN_QUANTIFIER]: SC.BEGIN_QUANTIFIER,
    [SC.END_QUANTIFIER]: SC.END_QUANTIFIER,
    [SC.QUANTIFIER_SEPARATOR]: SC.QUANTIFIER_SEPARATOR
};

/**
 * Available quantifiers. Use quantifier special characters to get their
 * quantifier data.
 * 
 * @enum {QuantifierData}
 * 
 * @see {SpecialCharacters}
 */
const Quantifiers = {
    DEFAULT: _quantifier(),
    [SC.ZERO_OR_ONE]: _quantifier(0, 1, SC.ZERO_OR_ONE),
    [SC.ONE_OR_MORE]: _quantifier(1, undefined, SC.ONE_OR_MORE),
    [SC.ZERO_OR_MORE]: _quantifier(0, undefined, SC.ZERO_OR_MORE)
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
    const tokens = _scan(expression);

    const result = {};

    let token = tokens.shift();
    if (token == SC.VARIABLE) {
        result.type = Types.VARIABLE;
        result.name = tokens.shift();
    } else {
        result.type = Types.LITERAL;
        result.name = token;
    }

    result.quantifier = _parseQuantifier(tokens);

    return result;
}

/**
 * @param {String} expression 
 * 
 * @returns {Array.<String>}
 */
function _scan(expression = required('expression')) {
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

    return tokens;
}

/**
 * @param {Array.<String>} tokens 
 * 
 * @returns {QuantifierData}
 */
function _parseQuantifier(tokens) {
    let token = tokens.shift();

    if (token === undefined) {
        return Quantifiers.DEFAULT;
    }

    if (token != SC.BEGIN_QUANTIFIER) {
        if (!Quantifiers.hasOwnProperty(token)) {
            throw error.Cannot_parse_quantifier__EXPRESSION(token);
        }

        return Quantifiers[token];
    }

    const quantifierTokens = [token];
    while (token !== undefined && token != SC.END_QUANTIFIER) {
        token = tokens.shift();

        quantifierTokens.push(token);
    }

    if (quantifierTokens.length == 2) { // {}
        return Quantifiers.DEFAULT;
    }

    const expression = quantifierTokens.join('');

    if (quantifierTokens.length == 3) { // {#}
        return _quantifier(quantifierTokens[1], quantifierTokens[1], expression);
    }

    if (quantifierTokens.length == 4) { // {,#} or {#,}
        if (quantifierTokens[1] == SC.QUANTIFIER_SEPARATOR) { // {,#}
            return _quantifier(undefined, quantifierTokens[2], expression);
        }

        return _quantifier(quantifierTokens[1], undefined, expression); // {#,}
    }

    if (quantifierTokens.length == 5) { // {#,#}
        return _quantifier(quantifierTokens[1], quantifierTokens[3], expression);
    }

    throw error.Cannot_parse_quantifier__EXPRESSION(quantifierTokens.join(''));
}

/**
 * @param {Number?} min 
 * @param {Number?} max 
 * 
 * @returns {QuantifierData}
 */
function _quantifier(min, max, expression) {
    if (min == null && max == null) {
        return { min: 1, max: 1, expression: null, data: null };
    }

    const result = { data: {} };

    if (min != null) {
        min = Number.parseInt(min);

        result.min = min;
        result.data.min = min;
    } else {
        result.min = 0;
    }

    if (max != null) {
        max = Number.parseInt(max);

        result.max = max;
        result.data.max = max;
    } else {
        result.max = Number.POSITIVE_INFINITY;
    }

    result.expression = expression;

    return result;
}

module.exports = {
    Types,
    Quantifiers,
    parse
};
