# Nested Literals

> TBD

`concepts`

```json
{
    "this": {
        "is": {
            "nested": {
                "literal": "$value"
            }
        }
    }
}
```

`schema`

```json
{
    "this": {
        "is": {
            "nested": {
                "literal": "text"
            }
        }
    }
}
```

`shadow schema`

```json
{
    "value": "text"
}
```

`shadow concepts`

```json
{
    "literals": [
        {
            "_": "this",
            "literals": [
                {
                    "_": "is",
                    "literals": [
                        {
                            "_": "nested",
                            "literals": [
                                {
                                    "_": "literal",
                                    "variables": [
                                        {
                                            "_": "value"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
```
