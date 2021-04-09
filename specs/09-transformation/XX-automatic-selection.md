# Automatic Selection

> TBD

Selection is by default with the same key.

```json
{
    "function": {
        "from": "service",
        "select": {
            "_": "_",
            "returnType": "returnType"
        }
    }
}
```

is equivalent to

```json
{
    "function": {
        "from": "service",
        "select": { }
    }
}
```

is equivalent to

```json
{
    "function": {
        "from": "service"
    }
}
```
