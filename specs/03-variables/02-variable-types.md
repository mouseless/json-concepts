# Variable Types

Variable types can be defined explicitly.

For this concepts definition, `$enabled:boolean` denotes that `$enabled` should
be a `boolean`;

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "$service+": {
        "$flag*": "$enabled:boolean"
    }
}
```

Concepts shadow contains type of a variable under `type` key;

`CONCEPTS SHADOW`

```json name="service.concepts-shadow.json"
{
    "concept": {
        "name": "service",
        "quantifier": { "min": 1 },
        "concept": {
            "name": "flag",
            "quantifier": { "min": 0 },
            "variable": {
                "name": "enabled",
                "type": "boolean"
            }
        }
    }
}
```

Below is an **invalid** schema;

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
{
    "sayGoodbye": {
        "async": "yes"
    }
}
```

`ERROR: 'greeting.service.json' is not valid, 'yes' is not valid a boolean.`

## Available Variable Types

- `:any` allows any type of value to be set to corresponding variable
- `:string` allows only string values
- `:boolean` allows only `true` or `false`
- `:number` allows only numbers

By default a variable type is implicitly `:any`, but it can be defined
explicitly;

`explicit.concepts.json`

```json name="available/explicit.concepts.json"
{
    "$service+": {
        "extra": "$extra:any"
    }
}
```

`implicit.concepts.json`

```json name="available/implicit.concepts.json"
{
    "$service+": {
        "extra": "$extra"
    }
}
```

> Note that `explicit.concepts.json` will have `type: "any"` in its shadow,
> whereas `implicit.concepts.json` won't.
