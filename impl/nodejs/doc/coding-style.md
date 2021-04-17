# Coding Style

## `require` and `module.exports` Usage

### Within a Package

```javascript
function doSomething () {
    otherStuff.help();
}

//requires are at the bottom to prevent circular dependency
const otherStuff = require('./other-stuff');
```

`./other-stuff.js`

```javascript
function help() {
    ...
}

module.exports = {
    help
};
```

### Sub Packages

```javascript
function doSomething() {
    something.helper();
}

const { something } = require('./sub-package')
```

`./sub-package/index.js`

```javascript
const something = require('./something');

module.exports = {
    something
};
```

`./sub-package/something.js`

```javascript
function help() {
    ...
}

module.exports = {
    help
};
```

### Importing Functions

```javascript
function doSomething () {
    help();
}

const { help } = require('./other-stuff');
const { helpFromSubPackage } = require('./sub-package');
```

`./other-stuff.js`

```javascript
function help() {
    ...
}

module.exports = {
    help
};
```

`./sub-package/index.js`

```javascript
const { helpFromSubPackage } = require('./something');

module.exports = {
    helpFromSubPackage
};
```

`./sub-package/something.js`

```javascript
function helpFromSubPackage() {
    ...
}

module.exports = {
    helpFromSubPackage
};
```

### Abbreviation for Long Class Names

```javascript
function doSomething() {
    AVLCN.help();
}

const { AVeryLongClassName: AVLCN } = require('./a-very-long-class-name');
```

## Boolean Parameters

```javascript
// Specify boolean parameter names explicitly when passing true or false
doSomething(withAnObject, andAString, /* someFlag */ true);

// No need to specify explicitly when it is obvious
const someFlag = true;
doSomething(withAnObject, andAString, someFlag);

// Still required when it is not that obvious
const irrelevantName = false;
doSomething(withAnObject, andAString, /* someFlag */ !irrelevantName);

```

## Parameters

```javascript
function(useOneLine, whenNonHave, defaultValue) {

}

function(useOneLineWhenOneParamWith = 'default value') {

}

function(
    use = 'multiple lines',
    when = 'at least',
    oneOf = 'them',
    hasDefaultValue
) {

}
```

## JSDoc

```javascript
/**
 * Public functions have JSDoc. Descriptions end with a dot.
 * 
 * @param {Object} parameter Document parameters as well
 * @param {Object} parameter2 But without line break and a dot
 * @param {Object} parameter3 When parameter description is long, continue in
 * the next line. But this time it ends with a dot.
 * 
 * @returns {String} Document returns with a line break after parameters. Just
 * like parameters, if it fits a single line don't end with a dot. If it is
 * long end with a dot.
 */
function public(parameter, parameter2, parameter3) {
    return 'calculation';
}

/**
 * Specify which parameter is required
 * 
 * @param {Object} required (Required) This is required
 * @param {Object} optional This is not
 * @param {boolean} hasDefault (Default: `false`) Document default value
 */
function parameters(
    required, 
    optional,
    hasDefault = false
) {
}

/**
 * Async functions has async tag before parameters
 * 
 * @async
 * @param {Object} parameter
 */
async function async(parameter) {

}

function _private() {
    // no JSDoc for private functions
}

class Class { // no JSDoc for classes
    /**
     * Any anonymous object is documented at the top of its class.
     * 
     * @typedef {Object} Type
     * @property {String} name Document properties like parameters
     */

    /**
     * Describe your class in constructor JSDoc.
     * 
     * Then describe constructor if necessary.
     */
    constructor() {

    }

    /**
     * Description of this property. Specify type in returns tag below, but
     * description is not required for it.
     * 
     * @returns {String}
     */
    get something() { return 'calculation'; }
}

/**
 * Description of your enum.
 * 
 * @enum {number}
 */
const Enum = {
    VALUE_1: 1,
    VALUE_2: 2
}
```

## Enums

```javascript
const Example = {
    VALUE_1: 1,
    VALUE_2: 2
};
```

## Classes

### Order of Definitions

```javascript
class Example {
    static publicStaticMethods() {

    }

    /* const */ #constFields;
    /* const */ #calculatedFields;

    /* let */ #letFields;

    constructor(constFields) {
        this.#constFields = constFields;

        this.#calculatedFields = "calculation";
    }

    get publicProperties() { return this.#constFields || this.#calculatedFields || this.#letFields; }
    get continuesWithoutLineBreak() { return this.#constFields || this.#calculatedFields || this.#letFields; }

    get _privateProperties() { return this.#constFields || this.#calculatedFields || this.#letFields; }

    oneLinePublicMethod() { return "calculation"; }
    alsoContinuesWithoutLineBreak() { return "calculation"; }

    publicMethods() {

    }

    _privateMethods() {

    }
}

function _privateStaticMethods() {
    
}
```

### Exported Publicly

`src/example.js`

```javascript
/* exported */ class Example {

}

module.exports = {
    Example
};
```

`index.js`

```javascript
const { Example } = require('./src/example');

module.exports = {
    Example
};
```

### Exported Privately

`src/example.js`

```javascript
class Example {

}

module.exports = {
    Example
};
```

### `const` Fields

```javascript
class Example {
    /* const */ #field;

    constructor(field) {
        this.#field = field;
    }
}
```

### `let` fields

```javascript
class Example {
    /* let */ #field;

    doSomething() {}
        this.#field = "a value";
    }
}
```
