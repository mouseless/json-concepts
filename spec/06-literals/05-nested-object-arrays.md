# Nested Object Arrays

Concepts definition can have nested object arrays like below;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "parameters?": [ {
            "name": "$name",
            "types": [ {
                "name": "$name",
                "validation": [ "$validators" ]
            } ]
        } ]
    }
}
```

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
                        "_": "types",
                        "variable": {
                            "dimensions": 1,
                            "literal": [
                                {
                                    "_": "name",
                                    "variable": { "_": "name" }
                                },
                                {
                                    "_": "validation",
                                    "variable": {
                                        "_": "validators",
                                        "dimensions": 1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    }
}
```

An example valid schema is as follows;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "parameters": [
            {
                "name": "name",
                "types": [
                    {
                        "name": "string",
                        "validation": [ "regex", "min" ]
                    },
                    {
                        "name": "text",
                        "validation": [ "regex", "max" ]
                    }
                ]
            },
            {
                "name": "surname",
                "types": [
                    {
                        "name": "string",
                        "validation": [ "regex" ]
                    }
                ]
            }
        ]
    }
}
```

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayHello",
            "parameters": [
                {
                    "name": "name",
                    "types": [
                        {
                            "name": "string",
                            "validators": [ "regex", "min" ]
                        },
                        {
                            "name": "text",
                            "validators": [ "regex", "max" ]
                        }
                    ]
                },
                {
                    "name": "surname",
                    "types": [
                        {
                            "name": "string",
                            "validators": [ "regex" ]
                        }
                    ]
                }
            ]
        }
    ]
}
```
