# Object Arrays

This is array of objects;

`service.concepts.json`

```json
{
    "$service+": {
        "parameters*": {
            "name": "$name", //parent variable name is parameters -> $parameters.name
            "type": "$type"
        }
    }
}
```

or this;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "parameters?": [
            {
                "name": "$pName",
                "type": "$pType"
            }
        ]
    }
}
```

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "parameter": [
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "surname",
                "type": "string"
            }
        ]
    }
}
```

`SHADOW SCHEMA`

```json
{
    "service": {
        "_": "sayHello",

        // normally literals does not go to shadow, but this one goes
        // because otherwise name and type cannot be in object format
        "parameter": [ 
            {
                "pName": "name",
                "pType": "string"
            },
            {
                "pName": "surname",
                "pType": "string"
            }
        ]
    }
}
```

## Concepts Under Object Arrays

> TBD should below definition, restrict each item to be the same, or should they
> be free to differ? maybe no, if you want to restrict, restrict them in
> concepts using literals...? if you restrict, what is the meaning of having an
> array anyway... it should not restrict, it should validate each item
> separately

```json
{
    "$service+": {
        "response?": [ { 
            "$property*": "$value"
        } ]
    }
}
```
