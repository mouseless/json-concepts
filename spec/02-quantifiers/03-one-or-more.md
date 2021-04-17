# One or More

`+` indicates that one or more of that concept can occur in a schema.

So for the following concepts definition, `$service+` indicates that there
will exist at least one `service` in every schema of this concepts file;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter?": "$type"
    }
}
```

Below schema is now valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": { 
        "name": "string"
    },
    "sayGoodbye": { }
}
```

## Key Literals

Unlike a concept, when a key literal has `+` quantifier it does not mean that
a key literal can occur more than once, because that means having the same key
in an object more than once, which is not allowed in JSON. So, to have a `+`
quantifier in a key literal means that right-hand side value should be an
array.

Below is an example concepts definition;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter?": "$type",
        "tags+": "$tags"
    }
}
```

This definition allows us to define an array in a schema. Below is a valid
schema;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "tags": [ "readonly", "friendly" ]
    },
    "sayGoodbye": {
        "tags": [ "readonly" ]
    }
}
```

Notice that this key literal would only accept an array now. So `tags` cannot
have `null` or a `string`, it should be an array;

## Requires At Least One

When no concept is given, schema becomes **INVALID**;

`SCHEMA: greeting.service.json`

```json
{
}
```

`ERROR: 'greeting.service.json' is not valid, at least one 'service' was`
`expected.`

A key literal is also expected to have at least one item in it. So below schema
is **NOT** valid as well;

`SCHEMA: greeting.service.json`

```json
{
    "sayGoodbye": {
        "tags": [ ]
    }
}
```

## Shadow Concepts

For following concepts definition, quantifier does not have a max;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter?": "$type",
        "tags+": "$tags"
    }
}
```

`SHADOW CONCEPTS`

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
                "min": 1
            },
            "variable": {
                "_": "tags"
            }
        },
        "concept": {
            "_": "parameter",
            "quantifier": {
                "min": 0,
                "max": 1
            },
            "variable": {
                "_": "type"
            }
        }
    }
}
```

## Shadow Schema

When there exists more than one concept in a schema, shadow schema stores them
in an array. Key literals are also stored in an array. Below is an example;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
        "tags": [ "readonly", "friendly" ]
    },
    "sayGoodbye": {
        "tags": [ "readonly" ]
    }
}
```

`SHADOW SCHEMA`

```json
{
    "service": [
        {
            "_": "sayHello",
            "parameter": {
                "_": "name",
                "type": "string"
            },
            "tags": [ "readonly", "friendly" ]
        },
        {
            "_": "sayHello",
            "parameter": [ ],
            "tags": [ "readonly" ]
        }
    ]
}
```

Notice that this time `parameter` concept was set to an empty array instead of
`null`, because its quantifier allows more than one instance;
