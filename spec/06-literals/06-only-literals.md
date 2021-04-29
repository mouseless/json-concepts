# Only Literals

A concepts definition is allowed to consist of only literals. Below example
demonstrates a simple literal-only concepts definition;

`CONCEPTS: service.concepts.json`

```json
{
    "service": {
        "name": "$name",
        "parameter": {
            "name": "$parameterName",
            "type": "$parameterType"
        }
    }
}
```

> Here `parameter` literal cannot have `$name` variable, because it would
> conflict with other `$name` variable.

`CONCEPTS SHADOW`

```json
{
    "literal": {
        "_": "service",
        "literal": [
            {
                "_": "name",
                "variable": { "_": "name" }
            },
            {
                "_": "parameter",
                "literal": [
                    {
                        "_": "name",
                        "variable": { "_": "parameterName" }
                    },
                    {
                        "_": "type",
                        "variable": { "_": "parameterType" }
                    }
                ]
            }
        ]
    }
}
```

`SCHEMA: greeting.service.json`

```json
{
    "service": {
        "name": "sayHello",
        "parameter": {
            "name": "name",
            "type": "string"
        }
    }
}
```

`SCHEMA SHADOW`

```json
{
    "name": "sayHello",
    "parameterName": "name",
    "parameterType": "string"
}
```

## Literals with Object Arrays instead of Concepts

`CONCEPTS: service.concepts.json`

```json
{
    "services": [ {
        "name": "$name",
        "parameters?": [ {
            "name": "$name",
            "type": "$type"
        } ]
    } ]
}
```

> Here `parameters` literal can have `$name` variable, because it has an object
> array as its variable, which means `parameters` will occur in schema shadow,
> hence there will be no conflict with other `$name` variable.

`CONCEPTS SHADOW`

```json
{
    "literal": {
        "_": "services",
        "variable": {
            "dimensions": 1,
            "literal": [
                {
                    "_": "name",
                    "variable": { "_": "name" }
                },
                {
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
            ]
        }
    }
}
```

`SCHEMA: greeting.service.json`

```json
{
    "services": [
        {
            "name": "sayHello",
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
    ]
}
```

`SCHEMA SHADOW`

```json
{
    "services": [
        {
            "name": "sayHello",
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
    ]
}
```

As you can see a schema, that conforms to a concepts definition which consists of
only literals, is identical with its shadow.
