# Declaring an Array

Below definition declares a `$tags` variable as an array under `tags` literal.

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "tags?": [ "$tags" ]
    }
}
```

When a variable is an array, its shadow has `dimensions` key;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "name": "service",
        "quantifier": { "min": 1 },
        "literal": {
            "name": "tags",
            "quantifier": { "min": 0, "max": 1 },
            "variable": {
                "name": "tags",
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
        "name": "service",
        "quantifier": { "min": 1 },
        "concept": {
            "name": "parameter",
            "quantifier": { "min": 0 },
            "variable": {
                "name": "types",
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
            "name": "sayHello",
            "parameter": [
                {
                    "name": "name",
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
            "name": "sayHello",
            "parameter": [
                {
                    "name": "name",
                    "types": [ "string" ]
                }
            ],
            "tags": [ "readonly" ]
        }
    ]
}
```

## Multi-Dimensional Arrays

Below concepts definition declares `$value` as a double array;

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
        "name": "matrix",
        "quantifier": { "min": 0 },
        "variable": {
            "name": "value",
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
            "name": "matrix-a",
            "value": [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]
        },
        {
            "name": "matrix-b",
            "value": [ [ 1, 2, 3 ] ]
        },
        {
            "name": "matrix-c",
            "value": [ [ 1 ] ]
        }
    ]
}
```
