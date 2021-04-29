# Validating Concept Name

Concept names can also be validated like variable values;

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

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "type": "identifier",
        "quantifier": { "min": 1 },
        "concept": {
            "_": "method",
            "type": "method",
            "quantifier": { "min": 0 },
            "concept": {
                "_": "parameter",
                "type": "identifier",
                "quantifier": { "min": 0 },
                "variable": {
                    "_": "type"
                }
            }
        }
    }
}
```

> Note that custom types used in concept names must derive from string.
