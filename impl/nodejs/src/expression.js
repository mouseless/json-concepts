const { SpecialCharacters: SC, error, required } = require('./util');

class Expression {
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
     * Parses only name part of an expression. `$concept:type*` returns
     * `$concept`, `literal?` returns `literal`.
     * 
     * @param {String} expression (Required) Value or key expression to parse
     * 
     * @returns {String} Parsed name
     */
    static parseName(expression = required('expression')) {
        const tokens = _scan(expression, _keySC);

        let result = tokens.shift();
        if (result == SC.VARIABLE) {
            result += tokens.shift();
        }

        return result;
    }

    /**
     * Parses key expression. Quantifier is null when it does not exist in the
     * expression.
     * 
     * @param {String} expression (Required) Key expression to parse
     * @param {Object.<string, import('./types').TypeData>} types (Required)
     * Type map.
     * 
     * @returns {Expression} Parsed expression object
     */
    static parseKey(
        expression = required('expression'),
        types = required('types')
    ) {
        const tokens = _scan(expression, _keySC);

        let isVariable, name, type, quantifier;

        let token = tokens.shift();
        if (token == SC.VARIABLE) {
            isVariable = true;
            name = tokens.shift();

            try {
                type = _parseType(tokens, types);
            } catch (e) {
                if (e.message == '' || _keySC[e.message]) {
                    throw error.Concepts_definition_is_not_valid__REASON(
                        because => because.Cannot_parse_EXPRESSION__a_type_was_expected_after_symbol(expression)
                    );
                }

                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.Unknown_type_TYPE_in_EXPRESSION(e.message, expression)
                );
            }
        } else {
            isVariable = false;
            name = token;
        }

        quantifier = _parseQuantifier(tokens);

        return new Expression(isVariable, name, type, quantifier);
    }

    /**
     * Parses value expression. Type is null when it does not exist in the
     * expression.
     * 
     * @param {String} expression (Required) Value expression to parse
     * @param {Object.<string, import('./types').TypeData>} types (Required)
     * Type map.
     * 
     * @returns {Expression} Parsed expression object
     */
    static parseValue(
        expression = required('expression'),
        types = required('types')
    ) {
        const tokens = _scan(expression, _valueSC);

        let isVariable, name, type;

        let token = tokens.shift();
        if (token == SC.VARIABLE) {
            isVariable = true;
            name = tokens.shift();

            try {
                type = _parseType(tokens, types);
            } catch (e) {
                if (e.message == '') {
                    throw error.Concepts_definition_is_not_valid__REASON(
                        because => because.Cannot_parse_EXPRESSION__a_type_was_expected_after_symbol(expression)
                    );
                }

                throw error.Concepts_definition_is_not_valid__REASON(
                    because => because.Unknown_type_TYPE_in_EXPRESSION(e.message, expression)
                );
            }
        } else {
            isVariable = false;
            name = token;
        }

        return new Expression(isVariable, name, type);
    }

    /* const */ #isVariable;
    /* const */ #name;
    /* const */ #type;
    /* const */ #quantifier;

    /**
     * Expression represents a key or a value expression. It is parsed using
     * parseKey or parseValue methods.
     * 
     * This constructor instantiate an instance of an Expression class. It also
     * ensures that this expression is a valid expression.
     * 
     * @param {Boolean} isVariable `true` for variables, `false` for literals
     * @param {String} name  Name of the expression
     * @param {import('./types').TypeData} type Type of the expression
     * @param {QuantifierData} quantifier Quantifier data of the expression
     */
    constructor(isVariable, name, type, quantifier) {
        this.#isVariable = isVariable;
        this.#name = name;
        this.#type = type;
        this.#quantifier = quantifier;

        if (this.isLiteral && this.isKey &&
            this.allowsMultiple
        ) {
            throw error.Concepts_definition_is_not_valid__REASON(
                because => because.LITERAL_cannot_have_QUANTIFIER(
                    this.name, this.quantifier.expression
                )
            );
        }

        if (this.isVariable && this.isKey &&
            !this.type.implicit && this.type.root.name !== 'string'
        ) {
            throw error.Concepts_definition_is_not_valid__REASON(
                because => because.CONCEPT_cannot_be_TYPE__only_string_allowed_but_TYPE_is_ROOT(
                    this.name, this.type.name, this.type.root.name
                )
            );
        }
    }

    /**
     * Checks if this expression is a variable expression or not.
     * 
     * @returns {Boolean} `true` if it is, `false` otherwise
     */
    get isVariable() { return this.#isVariable; }
    /**
     * Checks if this expression is a literal expression or not.
     * 
     * @returns {Boolean} `true` if it is, `false` otherwise
     */
    get isLiteral() { return !this.#isVariable; }
    /**
     * Name part of parsed expression.
     * 
     * @returns {String}
     */
    get name() { return this.#name; }
    /**
     * Type part of parsed expression. Returns `undefined` when type did not
     * exist in parsed expression.
     * 
     * @returns {import('./types').TypeData}
     */
    get type() { return this.#type; }
    /**
     * Quantifier part of parsed expression. Available only when this is a key
     * expression.
     * 
     * @returns {QuantifierData}
     */
    get quantifier() { return this.#quantifier; }
    /**
     * Checks if this expression is a key expression.
     * 
     * @returns {Boolean} `true` if it is, `false` otherwise
     */
    get isKey() { return this.#quantifier !== undefined; }
    /**
     * Checks if this expression is a value expression.
     * 
     * @returns {Boolean} `true` if it is, `false` otherwise
     */
    get isValue() { return this.#quantifier === undefined; }
    /**
     * Checks if this key expression allows multiple instances according to its
     * quantifier data.
     * 
     * @returns {Boolean} `true` if it does, `false` otherwise.
     */
    get allowsMultiple() { return this.isKey && this.#quantifier.max > 1; }

    /**
     * Validates given quantity against its quantifier. Works only for key
     * variable (aka concept) expressions
     * 
     * @param {Number} quantity Quantity to validate
     */
    validate(quantity = required('quantity')) {
        if (quantity < this.#quantifier.min) {
            if (this.#quantifier == _quantifiers.DEFAULT) {
                throw error.Schema_definition_is_not_valid__REASON(
                    because => because.CONCEPT_is_missing(this.#name)
                );
            } else {
                throw error.Schema_definition_is_not_valid__REASON(
                    because => because.Minimum_allowed_number_of_CONCEPT_is_MIN__but_got_COUNT(
                        this.#name, this.#quantifier.min, quantity
                    )
                );
            }
        } else if (quantity > this.#quantifier.max) {
            throw error.Schema_definition_is_not_valid__REASON(
                because => because.Maximum_allowed_number_of_CONCEPT_is_MAX__but_got_COUNT(
                    this.#name, this.#quantifier.max, quantity
                )
            );
        }
    }
}

/**
 * @enum {QuantifierData}
 */
const _quantifiers = {
    DEFAULT: _quantifier(),
    [SC.ZERO_OR_ONE]: _quantifier(0, 1, SC.ZERO_OR_ONE),
    [SC.ONE_OR_MORE]: _quantifier(1, undefined, SC.ONE_OR_MORE),
    [SC.ZERO_OR_MORE]: _quantifier(0, undefined, SC.ZERO_OR_MORE)
};

const _keySC = {
    [SC.VARIABLE]: SC.VARIABLE,
    [SC.TYPE]: SC.TYPE,
    [SC.ZERO_OR_ONE]: SC.ZERO_OR_ONE,
    [SC.ZERO_OR_MORE]: SC.ZERO_OR_MORE,
    [SC.ONE_OR_MORE]: SC.ONE_OR_MORE,
    [SC.BEGIN_QUANTIFIER]: SC.BEGIN_QUANTIFIER,
    [SC.END_QUANTIFIER]: SC.END_QUANTIFIER,
    [SC.QUANTIFIER_SEPARATOR]: SC.QUANTIFIER_SEPARATOR
};

const _valueSC = {
    [SC.VARIABLE]: SC.VARIABLE,
    [SC.TYPE]: SC.TYPE
};

/**
 * @param {String} expression
 * @param {Object} scHash
 * 
 * @returns {Array.<String>}
 */
function _scan(
    expression = required('expression'),
    scHash = required('scHash')
) {
    const tokens = [];

    let escape = false;
    let current = '';
    for (const c of expression) {
        if (escape) {
            current += c;
            escape = false;

            continue;
        }

        if (c == SC.ESCAPE) {
            escape = true;

            continue;
        }

        if (scHash[c]) {
            if (current.length > 0) {
                tokens.push(current);
                current = '';
            }

            tokens.push(scHash[c]);
            continue;
        }

        current += c;
    }

    if (current.length > 0) {
        tokens.push(current);
    }

    return tokens;
}

/**
 * 
 * @param {Array.<String>} tokens 
 * @param {Object.<string, import('./types').TypeData>} types
 * @param {String} expression
 * 
 * @returns {import('./types').TypeData}
 */
function _parseType(
    tokens = required('tokens'),
    types = required('types')
) {
    let token = tokens.shift();

    if (token !== SC.TYPE) {
        tokens.unshift(token);

        return types.implicit;
    }

    const name = tokens.shift();

    if (!types[name]) {
        throw new Error(name);
    }

    return types[name];
}

/**
 * @param {Array.<String>} tokens 
 * 
 * @returns {QuantifierData}
 */
function _parseQuantifier(tokens) {
    let token = tokens.shift();

    if (token === undefined) {
        return _quantifiers.DEFAULT;
    }

    if (token != SC.BEGIN_QUANTIFIER) {
        if (!_quantifiers[token]) {
            throw error.Concepts_definition_is_not_valid__REASON(
                because => because.Cannot_parse_quantifier__EXPRESSION(token)
            );
        }

        return _quantifiers[token];
    }

    const quantifierTokens = [token];
    while (token !== undefined && token != SC.END_QUANTIFIER) {
        token = tokens.shift();

        quantifierTokens.push(token);
    }

    if (quantifierTokens.length == 2) { // {}
        return _quantifiers.DEFAULT;
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

    throw error.Concepts_definition_is_not_valid__REASON(
        because => because.Cannot_parse_quantifier__EXPRESSION(quantifierTokens.join(''))
    );
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

module.exports = Expression;
