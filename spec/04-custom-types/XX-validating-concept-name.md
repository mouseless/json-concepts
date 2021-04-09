# Validating Concept Name

```json
{
    "$service:identifier+": {
        "$method:method*": {
            "$parameter:identifier*": "$type"
        }
    },
    ":": {
        "identifier": "/^[a-zA-Z0-9]*$/",
        "method": [ "get", "post", "put", "delete" ]
    }
}
```
