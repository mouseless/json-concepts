# Zero or More

A concept with `*` is allowed to occur any number of times in a schema. In
below concepts definition, `$parameter*` expression means that any number of
parameters are allowed under a service concept;

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

When a key literal has `*` it means that it may not exist in a schema, and when
it does, it should be a an array. An example is as follows;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "tags*": "$tags"
    }
}
```

Here `tags*` expression tells us that there may or may not be a `tags` literal
in schemas, and when there is, it should be assigned to an array. Following
schema is valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "surname": "string",
        "tags": [ "readonly", "friendly" ]
    },
    "sayGoodbye": { }
}
```

## Concepts Shadow

For following concepts definition, quantifiers of `parameter` and `tags` have
their min set to zero;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type",
        "tags*": "$tags"
    }
}
```

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service",
        "quantifier": {
            "min": 1
        },
        "literal": {
            "_": "tags",
            "quantifier": {
                "min": 0
            },
            "variable": {
                "_": "tags"
            }
        },
        "concept": {
            "_": "parameter",
            "quantifier": {
                "min": 0
            },
            "variable": {
                "_": "tags"
            }
        }
    }
}
```

## Schema Shadow

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "surname": "string",
        "tags": [ "readonly", "friendly" ]
    },
    "sayGoodbye": { }
}
```

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayHello",
            "parameter": [
                {
                    "_": "name",
                    "type": "string"
                },
                {
                    "_": "surname",
                    "type": "string"
                }
            ],
            "tags": [ "readonly", "friendly" ]
        },
        {
            "_": "sayGoodbye",
            "parameter": [ ],
            "tags": [ ]
        }
    ]
}
```

> Notice that `parameter` and `tags` were set to empty arrays instead of
> `null`, because their quantifiers allow more than one instance.
