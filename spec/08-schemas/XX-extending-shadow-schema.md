# Extending Shadow Schema

> TBD - shadow schema should be extensible to add more short-cut keys

```json
{
    "service": [
        {
            "service": "sayHello",
            "_": "sayHello",
            "_first": true,
            "_last": false
        },
        {
            "service": "sayGoodbye",
            "_": "sayGoodbye",
            "_first": false,
            "_last": true
        }

    ]
}
```
