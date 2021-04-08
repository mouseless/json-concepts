# Non-String Variables

When a value of a variable is a boolean or a number, surrounding quotes are
removed in output schema.

For this schema;

`service.concepts.json`

```json
{
    "$service+": {
        "async": "$async",
        "limit": "$limit"
    }
}
```

When `$async` and `$limit` variables have `true` and `100`;

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayGoodbye",
            "async": true,
            "limit": 100
        }
    ]
}
```

Result is;

`greeting.service.json`

```json
{
    "sayGoodbye": {
        "async": true,
        "limit": 100
    }
}
```
