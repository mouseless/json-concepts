# Case-Sensitive

Matching data keys with concepts names are by default case-sensitive. You can
change this behavior by setting `caseSensitive` option to `false`.

`service.concepts.json`

```json
{
    "$service+": {
        "$parameter*": "$type"
    },
    "?": {
        "key": "name",
        "caseSensitive": false
    }
}
```

So for this data;

`greeting.json`

```json
{
    "Service": [
        {
            "Name": "sayGoodbye",
            "Parameter": [
                {
                    "Name": "name",
                    "Type": "string"
                },
                {
                    "Name": "surname",
                    "Type": "string"
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
