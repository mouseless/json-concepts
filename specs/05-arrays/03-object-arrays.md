# Object Arrays

Object arrays can be defined using below syntax;

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "$service+": {
        "parameters?": [ {
            "name": "$pName",
            "type": "$pType"
        } ]
    }
}
```

This definition indicates that `parameters` literal expects to have an array of
objects with `name` and `type` keys.

`CONCEPTS SHADOW`

```json name="service.concepts-shadow.json"
{
    "concept": {
        "name": "service",
        "quantifier": { "min": 1 },
        "literal": {
            "name": "parameters",
            "quantifier": { "min": 0, "max": 1 },
            "variable": {
                "dimensions": 1,
                "literal": [
                    {
                        "name": "name",
                        "variable": { "name": "pName" }
                    },
                    {
                        "name": "type",
                        "variable": { "name": "pType" }
                    }
                ]
            }
        }
    }
}
```

In concepts shadow, object array is represented as a variable with the
dimensions of the array definition. Since object array does not have a name,
this variable node does not have a `name` key.

## Schema

A valid schema for previous concepts definition is as follows;

`SCHEMA: greeting.service.json`

```json name="schema/greeting.service.json"
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

A schema shadow does not contain literals. However, in case of object arrays,
it **does** contain name of the literal. Below, you can see that `parameters`
literal appear in the schema shadow;

`SCHEMA SHADOW`

```json name="schema/greeting.service-shadow.json"
{
    "service": [
            {
            "name": "sayHello",
            "parameters": [ 
                {
                    "pName": "name",
                    "pType": "string"
                },
                {
                    "pName": "surname",
                    "pType": "string"
                }
            ]
        }
    ]
}
```

## Concepts vs Object Arrays

Object arrays and concepts can be two different flavors to get to the same
schema shadow. Below is an example to get exactly the same schema shadow from
two different concepts definition.

- Using concepts

    `CONCEPTS: service.concepts.json`

    ```json name="concepts-vs-arrays/concepts/service.concepts.json"
    {
        "$service+": {
            "$parameter*": "$type"
        }
    } 
    ```

    `SCHEMA: greeting.service.json`

    ```json name="concepts-vs-arrays/concepts/greeting.service.json"
    {
        "sayHello": {
            "name": "string",
            "surname": "string"
        }
    }
    ```

- Using object arrays

    `CONCEPTS: service.concepts.json`

    ```json name="concepts-vs-arrays/arrays/service.concepts.json"
    {
        "$service+": {
            "parameter?": [ {
                "name": "$name",
                "type": "$type"
            } ]
        }
    } 
    ```

    `SCHEMA: greeting.service.json`

    ```json name="concepts-vs-arrays/arrays/greeting.service.json"
    {
        "sayHello": {
            "parameter": [
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

Schema shadow is the same for both of the above schemas;

`SCHEMA SHADOW`

```json name="concepts-vs-arrays/greeting.service-shadow.json"
{
    "service": [
        {
            "name": "sayHello",
            "parameter": [
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
    ]
}
```

## Concepts and Object Arrays

Concepts and object arrays can also be used together. There are 3 possible cases
for such definitions.

1. Concepts under object arrays:

    ```json name="concepts-and-arrays/sample-1.concepts.json"
    {
        "array?": [ {
            "$field*": "$value"
        } ]
    }
    ```

2. Object arrays under concepts:

    ```json name="concepts-and-arrays/sample-2.concepts.json"
    {
        "$data*": [ {
            "name": "$name",
            "value": "$value"
        } ]
    }
    ```

3. Concepts under object arrays under concepts;

    ```json name="concepts-and-arrays/sample-3.concepts.json"
    {
        "$data*": [ {
            "$field*": "$value"
        } ]
    }

No schema validation or shadow is specified since there are no apparent use
cases for above definitions. So implementations are free to handle above
definitions in whatever way they choose to.

## Multi-Dimensional Array

It should support multi-dimensional array definitions. Below is an example;

`CONCEPTS: matrix.concepts.json`

```json name="multi-dimensional/matrix.concepts.json"
{
    "matrix": [ [ { "value": "$value" } ] ]
}
```

`SCHEMA: two.matrix.json`

```json name="multi-dimensional/two.matrix.json"
{
    "matrix": [ [ { "value": 1 }, { "value": 2 } ] ]
}
```

Note that just like regular arrays, it allows less dimensions;

`SCHEMA: one.matrix.json`

```json name="multi-dimensional/one.matrix.json"
{
    "matrix": [ { "value": 1 }, { "value": 2 } ]
}
```

`SCHEMA: zero.matrix.json`

```json name="multi-dimensional/zero.matrix.json"
{
    "matrix": { "value": 1 }
}
```

But does not allow more dimensions;

`SCHEMA: invalid.matrix.json`

```json name="multi-dimensional/invalid.matrix.json"
{
    "matrix": [ [ [ { "value": 1 } ] ] ]
}
```

`ERROR: 'invalid.matrix.json' is not valid, 'matrix' expects at most 2
dimensions, but got 3.`
