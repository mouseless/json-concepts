# Zero or One

`?` indicates that the concept might or might not exist in output schemas.

So for the following, `$parameter?` indicates that parameter concept is
optional for service concept;

`service.concepts.json`

```json
{
    "$service": {
        "$parameter?": "string"
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

Creates this schema;

`greeting.service.json`

```json
{
    "sayHello": { }
}
```
