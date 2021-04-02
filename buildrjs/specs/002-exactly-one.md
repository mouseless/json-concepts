# Exactly One

A concept definition, by default, means that exactly one of that concept will
be allowed in output schemas.

So for the following concepts, `service` and `parameter` instances should be
exactly one for every schema of this definition.

`service.concepts.json`

```json
{
    "$service": {
        "$parameter": "string"
    }
}
```

Therefore this data;

`greeting.json`

```json
{
    "service": {
        "_key": "sayHello",
    }
}
```

or this data;

`greeting.json`

```json
{
}
```

will **NOT** create a schema, because it is missing a parameter data. So it
will give a proper validation error.
