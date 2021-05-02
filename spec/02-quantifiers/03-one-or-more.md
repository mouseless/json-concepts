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

## Requires At Least One

When no concept is given, schema becomes **INVALID**;

`SCHEMA: greeting.service.json`

```json
{
}
```

`ERROR: 'greeting.service.json' is not valid, at least one 'service' was
expected.`

## Key Literals

Key literals cannot have `+` quantifier, because they cannot occur more than
once. Below concepts definition is invalid;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter?": "$type",
        "tags+": "$tags"
    }
}
```

`ERROR: 'service.concepts.json' is not valid, 'tags' cannot have '+'
quantifier.`

## Concepts Shadow

For following concepts definition, quantifier of `service` doesn't have a max;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$parameter?": "$type"
    }
}
```

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "_": "service", 
        "quantifier": { "min": 1 },
        "concept": {
            "_": "parameter",
            "quantifier": { "min": 0, "max": 1 },
            "variable": {
                "_": "type"
            }
        }
    }
}
```

## Schema Shadow

When there more than one concept is allowed in a schema, schema shadow stores
them in an array;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
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
            "parameter": {
                "_": "name",
                "type": "string"
            }
        },
        {
            "_": "sayGoodbye",
            "parameter": null
        }
    ]
}
```

Even if there is only one `service` instance, schema shadow still has it in an
array;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string",
    }
}
```

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayHello",
            "parameter": {
                "_": "name",
                "type": "string"
            }
        }
    ]
}
```
