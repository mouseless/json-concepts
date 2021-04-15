const VARIABLE = "$";
const PREPROCESSOR = "#";
const TYPE = ":";
const META_DATA = "@";
const ZERO_OR_ONE = "?";
const ONE_OR_MORE = "+";
const ZERO_OR_MORE = "*";
const PATH = "/";
const PARENT = "..";
const ANY = "*";
const ANY_CHILD = "**";
const SELF = "_";

function is(specialCharacter, expression) {
    return expression.startsWith(specialCharacter);
}

function to(specialCharacter, name) {
    return `${specialCharacter}${name}`;
}

function from(specialCharacter, variableName) {
    if (!is(specialCharacter, variableName)) {
        return variableName;
    }

    return variableName.substring(VARIABLE.length);
}

module.exports = {
    VARIABLE,
    PREPROCESSOR,
    TYPE,
    META_DATA,
    ZERO_OR_ONE,
    ONE_OR_MORE,
    ZERO_OR_MORE,
    PATH,
    PARENT,
    ANY,
    ANY_CHILD,
    SELF,

    is,
    to,
    from
};