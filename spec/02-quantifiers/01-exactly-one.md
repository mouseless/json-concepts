# Exactly One

A concept definition, by default, means that exactly one of that concept will
be allowed in output schemas.

So for the following concepts definition, `service` and `parameter` instances
should be exactly one for every schema of this definition.

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type"
    }
}
```

We've already seen that following schema is valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

## Missing a Concept

However following schema is **NOT** valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": { }
}
```

Because it is missing a `parameter`. Validation should give an error containing
the missing concept name;

`ERROR: 'greeting.service.json' is not valid, 'parameter' concept is missing.`

## Missing More Than One Concept

Below schema is missing both `service` and a `parameter` data;

`SCHEMA: greeting.service.json`

```json
{
}
```

Validation should throw an error with message containing `service`;

`ERROR: 'greeting.service.json' is not valid, 'service' concept is missing.`

## Key Literals

Just like a concept, a key literal is also required by default;

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "response": "$responseType"
    }
}
```

Following schema will **NOT** be validated;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": { }
}
```

Error message should contain the missing literal;

`ERROR: 'greeting.service.json' is not valid, 'response' literal is missing.`

## Null Variables

`?` quantifier does not mean a variable is required. It is valid to set
variables to `null`. So below schema is **VALID**;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": { 
        "name": null,
        "response": null
    }
}
```

And its shadow is as follows;

`SHADOW SCHEMA`

```json
{
    "service": {
        "_": "sayHello",
        "parameter": {
            "_": "name",
            "type": null
        },
        "responseType": null
    }
}
```
