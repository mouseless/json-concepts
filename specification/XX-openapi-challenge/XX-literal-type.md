# Literal Type

```json
{
    "$company*": {
        "url": "$url",
        "!contact?": {
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
            "company": "amazon",
            "url": "amazon.com",
            "contact": {
                "url": "jeff.com"
            }
        }
    ]
}
```
