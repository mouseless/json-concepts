# Literals At The Root

Literals can be at the root of the concepts definition;

`CONCEPTS: service.concepts.json`

```json
{
    "services?": {
        "$service+": "$response"
    }
}
```

`CONCEPTS SHADOW`

```json
{
    "literal": {
        "_": "services",
        "quantifier": { "min": 0, "max": 1 },
        "concept": {
            "_": "service",
            "quantifier": { "min": 1 },
            "variable": { "_": "response" }
        }
    }
}
```

Below is a valid schema;

`SCHEMA: greeting.service.json`

```json
{
    "services": {
        "sayHello": "string",
        "sayGoodbye": "string"
    }
}
```

Schema shadow does not include literal;

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayHello",
            "response": "string"
        },
        {
            "_": "sayGoodbye",
            "response": "string"
        }
    ]
}
```
