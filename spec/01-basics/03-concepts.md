# Concepts

When a **key** starts with a `$` sign, it indicates that it is a concept. In below
concepts file, there are two concepts `$service` and `$parameter`.

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type"
    }
}
```

Below schema is a valid schema against above concepts file;

`SCHEMA: greeting.service.json`

```json
{
    "sayGoodbye": {
        "cry": "boolean"
    }
}
```

## Key Literals Under Concepts

You can define a key literal under a concept. For the following concepts file
`response` is a key literal under `$service` concept;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Below is a valid schema for above concepts file;

`SCHEMA: greeting.service.json`

```json
{
    "sayGoodbye": {
        "cry": "boolean",
        "response": "string"
    }
}
```

## Conflicts in Key Literals and Concepts

For below concepts file, `$parameter` concept cannot be `response`, because
there is already a key literal with that name;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

For this reason below schema is **NOT** valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayGoodbye": {
        "response": "string",
        "response": "string"
    }
}
```
