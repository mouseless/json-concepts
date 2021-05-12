# Concept Keys in Shadows

> TBD -> change default from `_` to `name`
> if it is an array, concept key is concept name:
> e.g. `$period` -> `period`
> if it is an object (either because max is `1` or it is forced object `!`),
> concept key is `name`
> if it is overridden, concept key is whatever specified:
> e.g. for `$database(type)`, key is `type`

```json
{
    "!$environment*": {
        "$database(type):database": "$connection"
    },
    "$period": [ "$urls" ]
}
```

```json
{
    "environment": {
        "development": {
            "name": "development",
            "database": {
                "type": "mysql",
                "connection": "..."
            }
        }
    }
}
```
