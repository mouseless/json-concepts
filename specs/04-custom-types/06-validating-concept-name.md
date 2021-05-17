# Validating Concept Name

A concept can also have a type like a variable;

`CONCEPTS: service.concepts.json`

```json
{
    "$service:identifier+": {
        "$method:method*": {
            "$parameter:identifier*": "$type"
        }
    },
    "@types": {
        "identifier": "^[a-zA-Z][0-9a-zA-Z]*$",
        "method": [ "get", "post", "put", "delete" ]
    }
}
```

This concepts definition indicates that `service` and `parameter` names are
expected to be valid `identifier`s, and `method` names to be valid `method`s.
Concepts shadow includes `type` information under the `concept` object;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "name": "service",
        "type": "identifier",
        "quantifier": { "min": 1 },
        "concept": {
            "name": "method",
            "type": "method",
            "quantifier": { "min": 0 },
            "concept": {
                "name": "parameter",
                "type": "identifier",
                "quantifier": { "min": 0 },
                "variable": {
                    "name": "type"
                }
            }
        }
    }
}
```

Types of concepts must be or derive from `string`, otherwise concepts definition
becomes **invalid**.
