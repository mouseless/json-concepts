# Concepts

When an expression on the **left-hand** side starts with a `$` sign, it
indicates that it is a concept. In below concepts definition, there are two
concepts: `$service` and `$parameter`.

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "$service": {
        "$parameter": "$type"
    }
}
```

Below schema is a valid schema against above concepts file;

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
{
    "sayGoodbye": {
        "cry": "boolean"
    }
}
```

## Key Literals Under Concepts

You can define a key literal under a concept. For the following concepts
definition `response` is a key literal under `$service` concept;

`CONCEPTS: service.concepts.json`

```json name="key-literals/service.concepts.json"
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Below is a valid schema for above concepts file;

`SCHEMA: greeting.service.json`

```json name="key-literals/greeting.service.json"
{
    "sayGoodbye": {
        "cry": "boolean",
        "response": "string"
    }
}
```

## Conflicts in Key Literals and Concepts

For below concepts definition, `$parameter` concept cannot be `response`,
because this definition already expects a key literal with that name;

`CONCEPTS: service.concepts.json`

```json name="conflicts/service.concepts.json"
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Below schema defines `response` key twice, which makes it an invalid JSON and an
invalid schema;

`SCHEMA: greeting.service.json`

```json name="conflicts/greeting.service.json"
{
    "sayGoodbye": {
        "response": "string",
        "response": "text"
    }
}
```
