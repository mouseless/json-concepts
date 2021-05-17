# Non-String Variables

A value of a variable can be `string`, `boolean` or a `number`.

For below concepts definition;

`CONCEPTS: service.concepts.json`

```json
{
    "$service+": {
        "$flag*": "$enabled",
        "limit": "$limit"
    }
}
```

`$enabled` and `$limit` variables can be `true` and `100` respectively. Below
schema is **valid**;

`SCHEMA: greeting.service.json`

```json
{
    "sayGoodbye": {
        "async": true,
        "limit": 100
    }
}
```

Schema shadow also contains these values as they appear in definition;

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "name": "sayGoodbye",
            "flag": [
                {
                    "name": "async",
                    "enabled": true
                }
            ],
            "limit": 100
        }
    ]
}
```
