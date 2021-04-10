# Key

In data json, `_key` property is expected for every concept. This property name
can be overridden.

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type"
    },
    "@options": {
        "key": "name"
    }
}
```

So for this data;

`greeting.json`

```json
{
    "service": [
        {
            "name": "sayGoodbye",
            "parameter": [
                {
                    "name": "name",
                    "type": "string"
                },
                {
                    "name": "surname",
                    "type": "string"
                }
            ]
        }
    ]
}
```

Output schema is;

`greeting.service.json`

```json
{
    "sayGoodbye": {
        "name": "string",
        "surname": "string"
    }
}
```
