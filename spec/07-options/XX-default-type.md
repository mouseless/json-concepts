# Default Type

```json
{
    "$service:identifier+": {
        "$method:method*": {
            "$parameter:identifier*": "$type:string"
        }
    },
    ":": {
        "identifier": "/^[a-zA-Z0-9]*$/",
        "method": [ "get", "post", "put", "delete" ]
    }
}
```

is equivalent to

```json
{
    "$service+": {
        "$method:method*": {
            "$parameter*": "$type"
        }
    },
    ":": {
        "identifier": "/^[a-zA-Z0-9]*$/",
        "method": [ "get", "post", "put", "delete" ]
    },
    "?": {
        "defaultType": {
            "concept": "identifier",
            "variable": "string"
        }
    }
}
```
