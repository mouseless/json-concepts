# Transformers

> TBD - will only be available in js

```json
{
    "$service+": {
        "name": "$name:name"
    },
    ":": {
        "name": {
            "type": "string",
            "custom": {
                "option1": true, 
                "option2": false
            }
        }
    },
    "?": {
        "transformers": {
            "append": "append.js"
        }
    }
}
```
