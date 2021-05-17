# Literals At The Root

Literals are allowed to be at the root of a concepts definition;

`CONCEPTS: service.concepts.json`

```json
{
    "services?": {
        "$service+": "$response"
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

Concepts shadow is as follows;

`CONCEPTS SHADOW`

```json
{
    "literal": {
        "name": "services",
        "quantifier": { "min": 0, "max": 1 },
        "concept": {
            "name": "service",
            "quantifier": { "min": 1 },
            "variable": { "name": "response" }
        }
    }
}
```

Schema shadow does not include literal;

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "name": "sayHello",
            "response": "string"
        },
        {
            "name": "sayGoodbye",
            "response": "string"
        }
    ]
}
```
