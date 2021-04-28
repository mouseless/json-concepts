# Declaring an Array

Below is an array declaration for a literal.

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "tags?": [ "$tags" ]
    }
}
```

Below is its shadow;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "quantifier": { "min": 1 },
        "literal": {
            "_": "tags",
            "quantifier": { "min": 0, "max": 1 },
            "variable": {
                "_": "tags",
                "dimensions": 1
            }
        }
    }
}
```

## Arrays for Concepts

Array declaration is the same with concepts, below is an example;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": [ "$types" ]
    }
}
```

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "quantifier": { "min": 1 },
        "concept": {
            "_": "parameter",
            "quantifier": { "min": 0 },
            "variable": {
                "_": "types",
                "dimensions": 1
            }
        }
    }
}
```

## Schemas

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": [ "$types" ],
        "tags?": [ "$tags" ]
    }
}
```

Given this concepts definition, below schema is valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": [ "string", "text" ],
        "tags": [ "readonly", "friendly" ]
    }
}
```

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayHello",
            "parameter": [
                {
                    "_": "name",
                    "types": [ "string", "text" ]
                }
            ],
            "tags": [ "readonly", "friendly" ]
        }
    ]
}
```

## Single Item

An array variable is allowed to have a single item without array notation.

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "tags": "readonly"
    }
}
```

Its shadow still contains an array;

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayHello",
            "parameter": [
                {
                    "_": "name",
                    "types": [ "string" ]
                }
            ],
            "tags": [ "readonly" ]
        }
    ]
}
```

## Multi-Dimensional Arrays

Below concepts definition has a double array for `$value` variable;

`CONCEPTS: matrix.concepts.json`

```json
{
    "$matrix*": [ [ "$value" ] ]
}
```

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "matrix",
        "quantifier": { "min": 0 },
        "variable": {
            "_": "value",
            "dimensions": 2
        }
    }
}
```

Multi-dimensional arrays allow single items as well. Below schema is a valid
one;

`SCHEMA: sample.matrix.json`

```json
{
    "matrix-a": [ [ 1, 2, 3 ], [ 4, 5, 6 ] ],
    "matrix-b": [ 1, 2, 3 ],
    "matrix-c": 1
}
```

`SCHEMA SHADOW`

```json
{
    "matrix": [
        {
            "_": "matrix-a",
            "value": [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]
        },
        {
            "_": "matrix-b",
            "value": [ [ 1, 2, 3 ] ]
        },
        {
            "_": "matrix-c",
            "value": [ [ 1 ] ]
        }
    ]
}
```
