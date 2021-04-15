# Multi Concepts

> TBD - should it be allowed to have multiple concepts, if so then how?

```json
{
    "$class*": {
        "$method*": {
            "$parameter*": "$type",
            "returns": "$returnType"   
        },
        "$property*": {
            "returns": "$returnType"
        }
    }
}
```

```json
{
    "user": {
        "name": {
            "returns": "string"
        }
    }
}
```

is name a method or property?
