# Concept Keys in Shadows

> TBD -> change default from `_` to `name`
> shadow should both have `name` and concept name for the key of its identifier.
> any child literal or variable with those keys will override its value.
> `name` key can be altered using index syntax `[]`;
> e.g. for `$database[type]`, key is `type`
> concept name can be pluralized using pluralization syntax `()`;
> e.g. for `$period(s)*`, concept parent key becomes `periods`
> e.g. for `$child(ren)*`, concept parent key becomes `children`
> e.g. for `$city(-ies)*`, concept parent key becomes `cities`
> e.g. for `$analysis(--es)*`, concept parent key becomes `analyses`
> e.g. for `$mouse(----ice)*`, concept parent key becomes `mice`
> e.g. for `$mouse(^mice)*`, concept parent key becomes `mice`

```json
{
    "!$environment*": {
        "$database[type]:db": "$connection"
    },
    "$period(s)*": [ "$urls" ],
    "@types": {
        "db": [ "mysql", "postgresql" ]
    }
}
```

```json
{
    "environment": {
        "development": {
            "environment": "development",
            "name": "development",
            "database": {
                "database": "mysql",
                "type": "mysql",
                "connection": "..."
            }
        }
    },
    "periods": [
        {
            "period": "0 0 * * *",
            "name": "0 0 * * *",
            "urls": [ "http://a.com", "http://b.com" ]
        }
    ]
}
```
