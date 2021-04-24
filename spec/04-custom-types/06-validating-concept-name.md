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
        "identifier": "/^[a-zA-Z][0-9a-zA-Z]*$/g",
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
    },
    "metaData": {
        "types": [
            {
                "_": "identifier",
                "type": "string",
                "validators": [
                    {
                        "_": "regex",
                        "value": "/^[a-zA-Z][0-9a-zA-Z]*$/g"
                    }
                ]
            },
            {
                "_": "method",
                "type": "string",
                "validators": [
                    {
                        "_": "enum",
                        "value": [ "get", "post", "put", "delete" ]
                    }
                ]
            }
        ]
    }
}
```

> Note that custom types used in concept names must derive from string.
