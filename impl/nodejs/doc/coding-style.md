# Coding Style

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
    get continueWithoutLineBreak() { return this.#constFields || this.#calculatedFields || this.#letFields; }

    get _privateProperties() { return this.#constFields || this.#calculatedFields || this.#letFields; }

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
