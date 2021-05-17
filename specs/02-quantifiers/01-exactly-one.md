# Exactly One

A concept, by default, requires exactly one instance in every schema. So the
following concepts definition expects exactly one `$service` and `$parameter` in
every schema.

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

However following schema is **not** valid;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": { }
}
```

Because it is missing a `$parameter`. Validation should give an error containing
the missing concept name;

`ERROR: 'greeting.service.json' is not valid, 'parameter' is missing.`

## Missing More Than One Concept

Below schema is missing both `$service` and a `$parameter` concepts;

`SCHEMA: greeting.service.json`

```json
{
}
```

Validation should throw an error with message containing `service`;

`ERROR: 'greeting.service.json' is not valid, 'service' is missing.`

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

Following schema will **not** be validated;

`SCHEMA: greeting.service.json`

```json
{
    "sayHello": { }
}
```

Error message should contain the missing literal;

`ERROR: 'greeting.service.json' is not valid, 'response' is missing.`

## Null Variables

It is valid to set variables to `null`. Below concepts has two variables `$type`
and `$responseType`.

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Below schema is **valid**;

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

`SCHEMA SHADOW`

```json
{
    "service": {
        "name": "sayHello",
        "parameter": {
            "name": "name",
            "type": null
        },
        "responseType": null
    }
}
```
