# Zero or One

`?` indicates that concept is optional and might or might not exist in schemas.
So for the following, `$parameter?` indicates that parameter concept is optional
under the `service` concept;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter?": "$type"
    }
}
```

So both of below schemas are valid now;

`SCHEMA 1: greeting.service.json`

```json
{
    "sayHello": { }
}
```

`SCHEMA 2: greeting.service.json`

```json
{
    "sayHello": { 
        "name": "string"
    }
}
```

## More Than One Concept Fails Validation

Below schema is **NOT** valid, because at most one parameter was expected;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": { 
        "name": "string",
        "surname": "string"
    }
}
```

It gives below error when this schema is loaded;

`ERROR: 'greeting.service.json' is not valid, maximum allowed number of
'parameter' is 1, but got 2.`

## Key Literals

A key literal also becomes optional with `?` at the end;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter?": "$type",
        "response?": "$responseType"
    }
}
```

Below schema becomes valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

## Concepts Shadow

Concepts shadow include quantifier information. For below concepts definition;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter?": "$type",
        "response?": "$responseType"
    }
}
```

Concepts shadow is as follows;

`CONCEPTS SHADOW`

```json
{
    "concept": {
        "name": "service",
        "literal": {
            "name": "response",
            "quantifier": { "min": 0, "max": 1 },
            "variable": {
                "name": "responseType"
            }
        },
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

When there are variables next to optional literals, schema shadow should set
variable value to `null`. When an optional concept is not defined in a schema,
schema shadow have `null` for that concept;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": { }
}
```

`SCHEMA SHADOW`

```json
{
    "service": {
        "name": "sayHello",
        "parameter": null,
        "responseType": null
    }
}
```

## Null Concepts

Below schema is also valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": null
}
```

It casts the same shadow above;

`SCHEMA SHADOW`

```json
{
    "service": {
        "name": "sayHello",
        "parameter": null,
        "responseType": null
    }
}
```
