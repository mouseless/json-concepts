# Import

> TBD

```json
[
    {
        "path": "/",
        "concept": {
            "#inc": "http://github.com/buildr/domain/v2/domain.concepts.json"
            // imports all concepts from remote to root path
        }
    },
    {
        "path": "/**/$domain",
        "concept": {
            "$event*": {}
        }
    }
    {
        "path": "/**/$event", //converts every path in imported concepts under this specified path
        "concept": {
            "#inc": "./parameter.concepts.json", //relative path
        }
    }
]
```
