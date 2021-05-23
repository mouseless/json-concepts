# Transformations

Transformation is a definition to transform a schema of one concepts definition
to another.

Assume you have two concepts definitions below;

`SOURCE: service.concepts.json`

```json name="service.concepts.json"
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

`TARGET: client.concepts.json`

```json name="client.concepts.json"
{
    "$function": {
        "$argument": "$type",
        "return": "$returnType"
    }
}
```

Following is a transformation from `$service` concepts to `$client` concepts;

`TRANSFORMATION: client.from.service.json`

```json name="client.from.service.json"
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

```json name="greeting.service.json"
{
    "sayHello": {
        "name": "string",
        "response": "string"
    }
}
```

and transforms it into this one;

`OUTPUT: greeting.client.json`

```json name="greeting.client.json"
{
    "sayHello": {
        "name": "string",
        "return": "string"
    }
}
```
