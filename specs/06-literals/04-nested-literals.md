# Nested Literals

A concept can have nested literals. In below example, it has `type` and `status`
literals nested under `response` literal.

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

Concepts shadow reflects this hierarchy as it appears in concepts definition;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "name": "service",
        "quantifier": { "min": 1 },
        "literal": {
            "name": "response",
            "literal": [
                {
                    "name": "type",
                    "variable": { "name": "type" }
                },
                {
                    "name": "status",
                    "variable": { "name": "status" }
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
arrays. So shadow only has `$type` and `$status` variables under `$service`
concept.

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "name": "sayHello",
            "type": "string",
            "status": 200
        }
    ]
}
```
