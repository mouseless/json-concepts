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
        "where": {
            "/say.*/": { } //this is a template object, match by regex
        },
        "select": {
            "_": "_ | after 'say' | camelCase",
            "returnType": "responseType | capitalize"
        }
    },
    "argument": {
        "from": "parameter",
        "select": {
            "type": "type | capitalize"
        }
    }
}
```

## Accessing Parent

```json
{
    "function": {
        "from": "service",
        "select": {
            "_": "_ | after 'say' | camelCase",
            "returnType": "responseType | capitalize"
        }
    },
    "argument": {
        "from": "parameter",
        "where": {
            "..": {
                "/say.*/": { }
             } //parameters where their parent starts with say
        },
        "select": {
            "type": "type | capitalize"
        }
    }
}
```

## Deep Scan

```json
{
    "function": {
        "from": "service",
        "where": {
            "**": { 
                "/.*name/": "/.*/"
            } // a parameter 
        },
        "select": {
            "_": "_ | after 'say' | camelCase",
            "returnType": "responseType | capitalize"
        }
    },
    "argument": {
        "from": "parameter",
        "select": {
            "type": "type | capitalize"
        }
    }
}
```
