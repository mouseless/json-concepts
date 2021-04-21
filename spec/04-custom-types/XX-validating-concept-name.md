# Validating Concept Name

```json
{
    "$service:identifier+": {
        "$method:method*": {
            "$parameter:identifier*": "$type"
        }
    },
    "@types": {
        "identifier": "/^[a-zA-Z0-9]*$/",
        "method": [ "get", "post", "put", "delete" ]
    }
}
```

> Concept name types must inherit from string
