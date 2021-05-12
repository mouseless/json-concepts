# Enable Hash

> TBD -> !$environment

```json
{
    "!$environment*": {
        "$database(type)": "$connection"
    }
}
```

```json
{
    "environment": {
        "development": {
            "name": "development",
            "database": {
                "type": "mysql",
                "connection": "..."
            }
        }
    }
}
```
