# Concepts Under A Literal

Concepts can be defined under a literal. Below definition has a `$property`
concept under the `response` literal;

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "$service+": {
        "response": {
            "$property*": "$type"
        }
    }
}
```

Below is a valid schema;

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
{
    "sayHello": {
        "response": {
            "message": "string",
            "status": "number"
        }
    }
}
```

Concepts shadow is as follows;

`CONCEPTS SHADOW`

```json name="service.concepts-shadow.json"
{
    "concept": {
        "name": "service",
        "quantifier": { "min": 1 },
        "literal": {
            "name": "response",
            "concept": {
                "name": "property",
                "quantifier": { "min": 0 },
                "variable": { "name": "type" }
            }
        }
    }
}
```

Schema shadow does not contain literal information. `$property` concept resides
directly under `$service` concept;

`SCHEMA SHADOW`

```json name="greeting.service-shadow.json"
{
    "service": [
        {
            "name": "sayHello",
            "property": [
                {
                    "name": "message",
                    "type": "string"
                },
                {
                    "name": "status",
                    "type": "number"
                }
            ]
        }
    ]
}
```
