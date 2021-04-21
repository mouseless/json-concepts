# Multi Concepts

> TBD - should it be allowed to have multiple concepts, if so then how?

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
        }
    }
}
```

is `name` a `method` or `property`? it is a `property`, because property concept
is defined before `method` concept.

so if a key is failed to fit to a concept, then it waits to be fit to a
concept. And if it fits to none of the concepts, then schema is invalid.

```json
{
    "$class*": {
        "$property?": {
            "returns": "$returnType"
        },
        "$method?": {
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
            "returns": "string"
        }
    }
}
```

This should not fail, because first is `property`, second is `method`.
