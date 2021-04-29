# Multiple Transformations

```json
{
    "function": [
    {
        "from": "service",
        "map": {
            "_": "_ | after 'say' | camelCase",
            "rootPath": "_",
            "returnType": "responseType | capitalize"
        }
    },
    {
        "from": "parameter",
        "map": {
            "_": "_",
            "type": "type | capitalize"
        }
    }
    ]
}
```
