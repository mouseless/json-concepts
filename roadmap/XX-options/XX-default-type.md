# Default Types

```json
{
    "$service:identifier+": {
        "$method:method*": {
            "$parameter:identifier*": "$type:string"
        }
    },
    "@types": {
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
    "@types": {
        "identifier": "/^[a-zA-Z0-9]*$/",
        "method": [ "get", "post", "put", "delete" ]
    },
    "@defaults": {
        "concept": "identifier",
        "variable": "string"
    }
}
```
