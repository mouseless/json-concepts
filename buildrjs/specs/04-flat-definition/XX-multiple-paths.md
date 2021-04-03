# Multiple Paths

> TBD

```json
[
    {
        "path": "/",
        "concept": {
            "$domain+": { }
        }
    },
    {
        "path": "/**/$domain",
        "concept": {
            "services?": {
                "$service+": { }
            }
        }
    },
    {
        "path": "/**/$domain",
        "concept": {
            "events?": {
                "$event+": { }
            }
        }
    },
    {
        "path": [ "/**/$service", "/**/$event" ],
        "concept": {
            "$parameter*": { }
        }
    }
]
```
