# Multiple Paths

> TBD

```json
[
    {
        "$domain+": { },
    },
    {
        "services?": {
            "$service+": { }
        },
        "@path": "/**/domain",
    },
    {
        "events?": {
            "$event+": { }
        },
        "@path": "/**/domain",
    },
    {
        "$parameter*": { },
        "@path": [ "/**/service", "/**/event" ],
    }
]
```
