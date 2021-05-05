# Literal Type

```json
{
    "$company*": {
        "url": "$url",
        "$contact:literal?": {
            "url": "$url"
        }
    }
}
```

```json
{
    "amazon": {
        "url": "amazon.com",
        "contact": {
            "url": "jeff.com"
        }
    }
}
```

```json
{
    "company": [
        {
            "_": "amazon",
            "url": "amazon.com",
            "contact": {
                "url": "jeff.com"
            }
        }
    ]
}
```
