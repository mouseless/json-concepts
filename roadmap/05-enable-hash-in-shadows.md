# Enable Hash

> TBD -> !$environment

```json
{
    "!$environment*": {
        "$database": "$connection"
    }
}
```

```json
{
    "environment": {
        "development": {
            "name": "development",
            "database": {
                "name": "mysql",
                "connection": "..."
            }
        }
    }
}
```
