# Import

> TBD

```json
[
    {
        "import": "http://github.com/buildr/domain/v2/domain.concepts.json" // imports all concepts from remote to root path
    },
    {
        "path": "/**/$domain",
        "concept": {
            "$event*": {}
        }
    }
    {
        "import": "/parameter.concepts.json", //relative path
        "path": "/**/$event" //converts every path in imported concepts under this specified path
    }
]
```
