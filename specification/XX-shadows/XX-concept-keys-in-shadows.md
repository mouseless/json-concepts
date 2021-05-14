# Concept Keys in Shadows

> TBD -> change default from `_` to name of the concept
> shadow should have name of the concept for the key of its identifier.
> if there is a child literal or variable with the name of the concept, this
> means it will override that value.
> default key can be altered using indexer syntax `[]`;
> e.g. for `$database[type]`, key is `type`
> e.g. for `$database[database,type]`, same value will be both at `type` and at
> `database`
>
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
    "$period(s)[cron]*": [ "$urls" ],
    
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
            "database": {
                "type": "mysql",
                "connection": "..."
            }
        }
    },
    "periods": [
        {
            "cron": "0 0 * * *",
            "urls": [ "http://a.com", "http://b.com" ]
        }
    ]
}
```
