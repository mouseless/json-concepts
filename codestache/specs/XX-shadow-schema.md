# Shadow Schema

> TBD Shadow schema is a template friendly version of your schema to enable
> concept names to be used to access schema content.

```json
{
    "$concepts": {
        "$parent": {
            "$child*": "$value"
        }
    },
    "turkey": {
        "istanbul": "34",
        "ankara": "06"
    }
}
```

```json
{
    "parent": {
        "_": "turkey",
        "parent": "turkey",
        "child": [
            {
                "_first": true,

                "_": "istanbul",
                "child": "istanbul",

                "value": "34",

                "_last": false
            },
            {
                "_first": false,

                "_": "ankara",
                "child": "ankara",
                
                "value": "06",

                "_last": true
            }
        ]
    }
}
```
