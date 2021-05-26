# Exactly One

A concept, by default, requires exactly one instance in every schema. So the
following concepts definition expects exactly one `$service` and `$parameter` in
every schema.

`CONCEPTS: service.concepts.json`

```json name="service.concepts.json"
{
    "$service": {
        "$parameter": "$type"
    }
}
```

We've already seen that following schema is valid;

`SCHEMA: greeting.service.json`

```json name="greeting.service.json"
{
    "sayHello": {
        "name": "string"
    }
}
```

## Missing a Concept

However following schema is **not** valid;

`SCHEMA: greeting.service.json`

```json name="missing-one/greeting.service.json"
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

```json name="missing-two/greeting.service.json"
{
}
```

Validation should throw an error with message containing `service`;

`ERROR: 'greeting.service.json' is not valid, 'service' is missing.`

## Key Literals

Just like a concept, a key literal is also required by default;

`CONCEPTS: service.concepts.json`

```json name="key-literals/service.concepts.json"
{
    "$service": {
        "response": "$responseType"
    }
}
```

Following schema is **invalid**;

`SCHEMA: greeting.service.json`

```json name="key-literals/greeting.service.json"
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

```json name="null/service.concepts.json"
{
    "$service": {
        "$parameter": "$type",
        "response": "$responseType"
    }
}
```

Below schema is **valid**;

`SCHEMA: greeting.service.json`

```json name="null/greeting.service.json"
{
    "sayHello": { 
        "name": null,
        "response": null
    }
}
```

And its shadow is as follows;

`SCHEMA SHADOW`

```json name="null/greeting.service-shadow.json"
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
