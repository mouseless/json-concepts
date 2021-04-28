# Object Arrays

Below is how to define array of objects;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "parameters?": [
            {
                "name": "$name",
                "type": "$type"
            }
        ]
    }
}
```

In concepts shadow, object array is represented as a variable with dimension of
array definition, however since object array does not have a name, this variable
node does not have a `"_"` key.

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "quantifier": { "min": 1 },
        "literal": {
            "_": "parameters",
            "quantifier": { "min": 0, "max": 1 },
            "variable": {
                "dimensions": 1,
                "literal": [
                    {
                        "_": "name",
                        "variable": { "_": "name" }
                    },
                    {
                        "_": "type",
                        "variable": { "_": "type" }
                    }
                ]
            }
        }
    }
}
```

## Schema

A valid schema is as follows;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "parameters": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "surname",
                "type": "string"
            }
        ]
    }
}
```

Normally shadows does not contain literal names, however in this case name of
the array is taken from its literal.

`SHADOW SCHEMA`

```json
{
    "service": {
        "_": "sayHello",
        "parameters": [ 
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "surname",
                "type": "string"
            }
        ]
    }
}
```

## Literal and Concept Conflicts

When a literal is in schema shadow, there occurs a chance of conflict between
literal and concept names. So a literal and a concept cannot share their name if
they are under the same scope. Below concepts definition is not valid;

`CONCEPTS: invalid.concepts.json`

```json
{
    "$conflict": "concept",
    "conflict": "literal"
}
```

`ERROR: 'invalid.concepts.json' is not valid, 'conflict' cannot be a literal`
`and concept at the same time.`

## Concepts and Object Arrays

Object arrays cannot be under a concept, it can only be declared under a
literal.

So this is invalid;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": { 
        "$parameters*": [
            {
                "type": "$type"
            }
        ]
    }
}
```

`ERROR: 'service.concepts.json' is not valid, cannot declare an object array`
`under a concept`

It is also invalid to declare a concept within an object array;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": { 
        "parameters?": [
            {
                "$property": "$value"
            }
        ]
    }
}
```

`ERROR: 'service.concepts.json' is not valid, cannot declare a concept under an`
`object array`
