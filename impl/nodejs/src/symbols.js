const VARIABLE = "$";
const PREPROCESSOR = "#";
const TYPE = ":";
const META_DATA = "@";
const ZERO_OR_ONE = "?";
const ONE_OR_MORE = "+";
const ZERO_OR_MORE = "*";
const PATH = "/";
const PARENT = "..";
const ANY_CHILD = "**";
const SELF = "_";

function isVariable(expression) {
    return expression.startsWith(VARIABLE);
}

function isMetaData(expression) {
    return expression.startsWith(META_DATA);
}

function variable(name) {
    return `${VARIABLE}${name}`;
}

function metaData(name) {
    return `${META_DATA}${name}`;
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
    ANY_CHILD,
    SELF,

    isVariable,
    variable,
    isMetaData,
    metaData
};