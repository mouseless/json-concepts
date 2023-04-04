# Literals At The Root

Literals are allowed to be at the root of a concepts definition;

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "services?": {
        "$service+": "$response"
    }
}
```

Below is a valid schema;

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
{
    "services": {
        "sayHello": "string",
        "sayGoodbye": "string"
    }
}
```

Concepts shadow is as follows;

`CONCEPTS SHADOW`

```json name="service.concepts-shadow.json"
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

```json name="greeting.service-shadow.json"
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
