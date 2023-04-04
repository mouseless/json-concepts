# Nested Object Arrays

Concepts definition can have nested object arrays like below;

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
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

An example valid schema is as follows;

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
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

Concepts and schema shadows are as follows;

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
                        "variable": { "name": "name" }
                    },
                    {
                        "name": "types",
                        "variable": {
                            "dimensions": 1,
                            "literal": [
                                {
                                    "name": "name",
                                    "variable": { "name": "name" }
                                },
                                {
                                    "name": "validation",
                                    "variable": {
                                        "name": "validators",
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

`SCHEMA SHADOW`

```json name="greeting.service-shadow.json"
{
    "service": [
        {
            "name": "sayHello",
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
