# Exactly One

A concept definition, by default, means that exactly one of that concept will
be allowed in output schemas.

So for the following concepts, `service` and `parameter` instances should be
exactly one for every schema of this definition.

## Case 1: Successful Generation

`CONCEPTS: service.concepts.json`

```json
{
    "$service": {
        "$parameter": "string"
    }
}
```

We've already seen that following data;

`DATA: greeting.json`

```json
{
    "service": {
        "_key": "sayHello",
        "parameter": {
            "_key": "name"
        }
    }
}
```

generates following schema;

`OUTPUT SCHEMA: greeting.service.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```

## Case 2: Missing `parameter`

However if you give following data to the same concepts file;

`DATA: greeting.json`

```json
{
    "service": {
        "_key": "sayHello",
    }
}
```

it will **NOT** create a schema, because it is missing a `parameter`.

`ERROR: Cannot create schema, parameter concept is required`

## Case 3: Missing `service` and `parameter`

Below data also fails to create an output schema because it is missing both a
`service` and a `parameter` data;

`DATA: greeting.json`

```json
{
}
```

`ERROR: Cannot create schema, service concept is required`
