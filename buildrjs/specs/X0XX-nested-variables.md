# Nested Variables

> TBD

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type.name"
    }
}
```

`greeting.json`

```json
{
    "service": [
        {
            "_key": "sayHello",
            "parameter": [
                {
                    "_key": "name",
                    "type": {
                        "name": "string"
                    }
                }
            ]
        }
    ]
}
```

`greeting.services.json`

```json
{
    "sayHello": {
        "name": "string"
    }
}
```
