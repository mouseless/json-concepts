# Zero or More

A concept with `*` is allowed to occur any number of times in a schema. In below
concepts definition, `$parameter*` expression means that any number of
parameters are allowed under a `$service` concept;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type"
    }
}
```

Following schema is now valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": { 
        "name": "string",
        "surname": "string"
    },
    "sayGoodbye": { }
}
```

## Key Literals

Key literals cannot have `*` quantifier, because they cannot occur more than
once. Below concepts definition is invalid;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter?": "$type",
        "tags*": "$tags"
    }
}
```

`ERROR: 'service.concepts.json' is not valid, 'tags' cannot have '*'
quantifier.`

## Concepts Shadow

For following concepts definition, quantifier of `$parameter` has its min set to
zero;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type"
    }
}
```

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "name": "service",
        "quantifier": { "min": 1 },
        "concept": {
            "name": "parameter",
            "quantifier": { "min": 0 },
            "variable": {
                "name": "type"
            }
        }
    }
}
```

## Schema Shadow

Default value for a concept is empty array instead of `null`, because its
quantifier allows more than one instance. In below schema `sayGoodbye` service
does not have a parameter, so in its shadow `parameter` is an empty array.

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "surname": "string"
    },
    "sayGoodbye": { }
}
```

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "name": "sayHello",
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
        },
        {
            "name": "sayGoodbye",
            "parameter": [ ]
        }
    ]
}
```
