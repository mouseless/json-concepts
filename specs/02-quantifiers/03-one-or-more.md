# One or More

`+` indicates that one or more of that concept can occur in a schema. So for the
following concepts definition, `$service+` indicates that there will exist at
least one `$service` in every schema;

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "$service+": {
        "$parameter?": "$type"
    }
}
```

Below schema is now valid;

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
{
    "sayHello": { 
        "name": "string"
    },
    "sayGoodbye": { }
}
```

## Requires At Least One

When no concept is given, schema becomes **invalid**;

`SCHEMA: greeting.service.json`

```json name="at-least-one/greeting.service.json"
{
}
```

`ERROR: 'greeting.service.json' is not valid, at least one 'service' was
expected.`

## Key Literals

Key literals cannot have `+` quantifier, because they cannot occur more than
once. Below concepts definition is invalid;

`CONCEPTS: service.concepts.json`

```json name="key-literals/service.concepts.json"
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

For following concepts definition, quantifier of `$service` doesn't have a max;

`CONCEPTS: service.concepts.json`

```json name="concepts-shadow/service.concepts.json"
{
    "$service+": {
        "$parameter?": "$type"
    }
}
```

`CONCEPTS SHADOW`

```json name="concepts-shadow/service.concepts-shadow.json"
{
    "concept": {
        "name": "service", 
        "quantifier": { "min": 1 },
        "concept": {
            "name": "parameter",
            "quantifier": { "min": 0, "max": 1 },
            "variable": {
                "name": "type"
            }
        }
    }
}
```

## Schema Shadow

When more than one concepts are allowed in a schema, schema shadow stores them
in an array;

`SCHEMA: greeting.service.json`

```json name="schema-shadow/greeting.service.json"
{
    "sayHello": {
        "name": "string",
    },
    "sayGoodbye": { }
}
```

`SCHEMA SHADOW`

```json name="schema-shadow/greeting.service-shadow.json"
{
    "service": [
        {
            "name": "sayHello",
            "parameter": {
                "name": "name",
                "type": "string"
            }
        },
        {
            "name": "sayGoodbye",
            "parameter": null
        }
    ]
}
```

Even if there is only one `$service`, schema shadow still has it in an array;

`SCHEMA: greeting-2.service.json`

```json name="schema-shadow/greeting-2.service.json"
{
    "sayHello": {
        "name": "string",
    }
}
```

`SCHEMA SHADOW`

```json name="schema-shadow/greeting-2.service-shadow.json"
{
    "service": [
        {
            "name": "sayHello",
            "parameter": {
                "name": "name",
                "type": "string"
            }
        }
    ]
}
```
