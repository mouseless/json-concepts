# Concepts Under A Literal

Concepts can be defined under a literal. Below, it defines a `property` concept
under the `response` literal;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "response": {
            "$property*": "$type"
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
            "concept": {
                "_": "property",
                "quantifier": { "min": 0 },
                "variable": { "_": "type" }
            }
        }
    }
}
```

Below is a valid schema;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "response": {
            "message": "string",
            "status": "number"
        }
    }
}
```

Shadow of this schema does not contain literal information. `property` concept
occurs directly under `service` concept;

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayHello",
            "property": [
                {
                    "_": "message",
                    "type": "string"
                },
                {
                    "_": "status",
                    "type": "number"
                }
            ]
        }
    ]
}
```
