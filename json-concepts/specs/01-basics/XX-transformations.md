# Transformations

> TBD

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

```json
{
    "$function": {
        "$argument": "$type",
        "return": "$returnType"
    }
}
```

```json
{
    "function": [
        {
            "_": "service",
            "filter": { 
                "say*": {
                }
            },
            "map": {
                "_": "_.after('say').camelCase()",
                "returnType": "responseType.capitalize()"
            }
        },
        {
            "_": "service",
            "filter": { 
                "get*": {
                }
            },
            "map": {
                "_": "_.camelCase()",
                "returnType": "responseType.capitalize()"
            }
        }
    ],
    "argument": {
        "$select": "parameter",
        "map": {
            "type": "type.capitalize()"
        }
    }
}
```

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    },
    "getName": {
        "name": "string",
        "response": "string"
    },
    "sayGoodbye": {
        "name": "string",
        "response": "string"
    }
}
```

```json
{
    "hello": {
        "name": "String",
        "return": "String"
    }
}
```
