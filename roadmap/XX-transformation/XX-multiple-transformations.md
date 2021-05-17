# Multiple Transformations

```json
{
    "function": [
    {
        "from": "service",
        "select": {
            "_": "_ | after 'say' | camelCase",
            "rootPath": "_",
            "returnType": "responseType | capitalize"
        }
    },
    {
        "from": "parameter",
        "select": {
            "_": "_",
            "type": "type | capitalize"
        }
    }
    ]
}
```
