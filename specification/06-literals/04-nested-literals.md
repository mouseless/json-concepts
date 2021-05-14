# Nested Literals

A concept can have nested literals. Below is an example;

`CONCEPTS: 'nested.concepts.json'`

```json
{
    "$service+": {
        "response": {
            "type": "$type",
            "status": "$status"
        }
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
            "_": "response",
            "literal": [
                {
                    "_": "type",
                    "variable": { "_": "type" }
                },
                {
                    "_": "status",
                    "variable": { "_": "status" }
                }
            ]
        }
    }
}
```

Below is a valid schema and its shadow;

`SCHEMA: 'text.nested.json'`

```json
{
    "sayHello": {
        "response": {
            "type": "string",
            "status": 200
        }
    }
}
```

Schema shadows are not allowed to have literals except the case with object
arrays. So shadow only has `type` and `status` variables under `service`
concept.

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayHello",
            "type": "string",
            "status": 200
        }
    ]
}
```
