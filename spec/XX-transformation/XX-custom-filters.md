# Custom Filters

```json
{
    "function": {
        "from": "service",
        "select": {
            "_": "_ | functionName"
        }
    },
    "@filters": {
        "functionName": "after 'say' | camelCase"
    }
}
```
