# Filter by Template Object

```json
{
    "$concepts": {
        "$service+": {
            "$parameter*": "$type",
            "response?": "$responseType"
        }
    },
    "sayHello": {
        "name": "string",
        "response": "string"
    },
    "saveGreeting": {
        "template": "string",
    }
}
```

```json
{
    "function": {
        "from": "service",
        "filter": {
            "say*": { } //this is a template object
        },
        "map": {
            "_": "_.after('say').camelCase()",
            "returnType": "responseType.capitalize()"
        }
    },
    "argument": {
        "from": "parameter",
        "map": {
            "type": "type.capitalize()"
        }
    }
}
```
