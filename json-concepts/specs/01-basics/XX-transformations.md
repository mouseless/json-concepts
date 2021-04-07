# Transformations

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
    "function": {
        "$select": "$..service[*]",
        "returnType": "responseType.capitalize()"
    },
    "argument": {
        "$select": "$..parameter[*]",
        "type": "type.capitalize()"
    }
}
```

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

```json
{
    "sayHello": {
        "name": "String",
        "return": "String"
    }
}
```
