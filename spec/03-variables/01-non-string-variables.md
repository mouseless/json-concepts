# Non-String Variables

A value of a variable can be a boolean or a number, surrounding quotes will not
be expected in a schema.

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
schema is **valid** and its shadow is as follows;

`SCHEMA: greeting.service.json`

```json
{
    "sayGoodbye": {
        "async": true,
        "limit": 100
    }
}
```

`SCHEMA SHADOW`

```json
{
    "service": [
        {
            "_": "sayGoodbye",
            "flag": [
                {
                    "_": "async",
                    "enabled": true
                }
            ],
            "limit": 100
        }
    ]
}
```
