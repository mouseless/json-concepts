# Transformations

Transformation is a definition to transform a schema of one concepts file to
another.

Assume you have two concepts file below;

`SOURCE: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

`TARGET: client.concepts.json`

```json
{
    "$function": {
        "$argument": "$type",
        "return": "$returnType"
    }
}
```

Following file is a transformation from `service` concepts to `client`
concepts;

`TRANSFORMATION: client.from.service.json`

```json
{
    "function": {
        "from": "service",
        "select": {
            "returnType": "responseType"
        }
    },
    "argument": {
        "from": "parameter",
        "select": {
            "type": "type"
        }
    }
}
```

Above transformation takes following schema;

`INPUT: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

and transforms it into this one;

`OUTPUT: greeting.client.json`

```json
{
    "sayHello": {
        "name": "string",
        "return": "string"
    }
}
```
