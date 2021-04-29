# Explicit Concepts and Literals

```json
{
    "$service+": {
        "$parameter*": "$type",
        "response?": "$responseType"
    }
}
```

```json
{
    "writeLog": {
        "response:parameter": "object",
        "response:literal": "string"
    }
}
```

> TBD when there is conflict, first one is literal, then the first concept
> `:parameter` means it is explicitly belongs to the `parameter` concept.

## Explicit Concepts

```json
{
    "$class*": {
        "$property*": {
            "returns": "$returnType"
        },
        "$method*": {
            "$parameter*": "$type",
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
        },
        "login": {
            "email": "string",
            "password": "string",
            "returns": "string"
        },
        "logout:method": {
            "returns": "number"
        }
    }
}
```

`logout` is an instance of method concept. Without `:method` it would be a
property.
